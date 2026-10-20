import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { STORE_CONFIG, INITIAL_PRODUCTS } from './src/data/initialProducts.ts';
import { Product } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In AI Studio container, Nginx binds to 8080 and proxies to port 3000.
// Dev server must strictly run on port 3000.
const PORT = process.env.PORT === '8080' ? 3000 : (process.env.PORT || 3000);
const isProd = process.env.NODE_ENV === 'production';

// Ensure data directories exist
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initialize products file if it doesn't exist
if (!fs.existsSync(PRODUCTS_FILE)) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(INITIAL_PRODUCTS, null, 2), 'utf-8');
}

// Initialize admin file if it doesn't exist
// Default credentials: admin@trenddropzz.com / trenddropzz2026
if (!fs.existsSync(ADMIN_FILE)) {
  const initialAdmin = {
    email: 'admin@trenddropzz.com',
    passwordHash: crypto.createHash('sha256').update('trenddropzz2026').digest('hex'),
    tokens: [] as string[],
  };
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(initialAdmin, null, 2), 'utf-8');
}

// Helpers for data read / write
function getProducts(): Product[] {
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading products file:', err);
    return INITIAL_PRODUCTS;
  }
}

function saveProducts(products: Product[]) {
  const tempFile = `${PRODUCTS_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(products, null, 2), 'utf-8');
  fs.renameSync(tempFile, PRODUCTS_FILE);
}

function getAdminData() {
  try {
    const raw = fs.readFileSync(ADMIN_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {
      email: 'admin@trenddropzz.com',
      passwordHash: crypto.createHash('sha256').update('trenddropzz2026').digest('hex'),
      tokens: [],
    };
  }
}

function saveAdminData(data: any) {
  const tempFile = `${ADMIN_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempFile, ADMIN_FILE);
}

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || `product-${Date.now()}`;
}

// Admin Auth Middleware
function checkAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required.' });
  }

  const token = authHeader.split(' ')[1];
  const admin = getAdminData();
  if (admin.tokens && admin.tokens.includes(token)) {
    return next();
  }

  return res.status(403).json({ error: 'Forbidden: Invalid or expired admin session token.' });
}

function isAdmin(req: Request): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.split(' ')[1];
  const admin = getAdminData();
  return Boolean(admin.tokens && admin.tokens.includes(token));
}

async function startServer() {
  const app = express();

  // Middleware for body parsing (allows larger payloads for uploaded images)
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Static directory for uploaded product media
  app.use('/uploads', express.static(UPLOADS_DIR));

  // --- API Endpoints ---

  // Store Configuration
  app.get('/api/config', (_req: Request, res: Response) => {
    res.json(STORE_CONFIG);
  });

  // Get Products List
  app.get('/api/products', (req: Request, res: Response) => {
    const products = getProducts();
    const adminMode = isAdmin(req);

    // If customer, only return published products
    const filtered = adminMode ? products : products.filter((p) => p.isPublished);

    // Filter by category if requested
    const category = req.query.category as string;
    if (category && category !== 'All') {
      return res.json(filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase()));
    }

    // Filter by search query if requested
    const search = req.query.q as string;
    if (search) {
      const q = search.toLowerCase();
      return res.json(
        filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        )
      );
    }

    res.json(filtered);
  });

  // Get Single Product by slug or id
  app.get('/api/products/:identifier', (req: Request, res: Response) => {
    const identifier = req.params.identifier;
    const products = getProducts();
    const adminMode = isAdmin(req);

    const product = products.find(
      (p) => p.slug === identifier || p.id === identifier
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    if (!product.isPublished && !adminMode) {
      return res.status(404).json({ error: 'Product is currently not available.' });
    }

    res.json(product);
  });

  // Create Product (Admin Only)
  app.post('/api/products', checkAdminAuth, (req: Request, res: Response) => {
    try {
      const {
        name,
        slug,
        price,
        discountPrice,
        description,
        category,
        images,
        stockStatus,
        stockCount,
        isPublished,
        isFeatured,
        highlights,
      } = req.body;

      if (!name || !price || !category) {
        return res.status(400).json({ error: 'Missing required fields (name, price, category).' });
      }

      const products = getProducts();
      let finalSlug = slug ? generateSlug(slug) : generateSlug(name);

      // Ensure slug uniqueness
      let counter = 1;
      const originalSlug = finalSlug;
      while (products.some((p) => p.slug === finalSlug)) {
        finalSlug = `${originalSlug}-${counter}`;
        counter++;
      }

      const newProduct: Product = {
        id: `prod-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
        slug: finalSlug,
        name: name.trim(),
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : Number(price),
        description: description || '',
        category: category.trim(),
        images: Array.isArray(images) && images.length > 0 ? images : ['/src/assets/images/hero_kitchen_home_showcase_1792352797924.jpg'],
        stockStatus: stockStatus || 'in_stock',
        stockCount: typeof stockCount === 'number' ? stockCount : 20,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        isFeatured: Boolean(isFeatured),
        highlights: Array.isArray(highlights) ? highlights : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      products.unshift(newProduct);
      saveProducts(products);

      res.status(201).json(newProduct);
    } catch (err: any) {
      console.error('Error creating product:', err);
      res.status(500).json({ error: err.message || 'Failed to create product.' });
    }
  });

  // Update Product (Admin Only)
  app.put('/api/products/:id', checkAdminAuth, (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const products = getProducts();
      const index = products.findIndex((p) => p.id === id || p.slug === id);

      if (index === -1) {
        return res.status(404).json({ error: 'Product not found.' });
      }

      const existing = products[index];
      const updates = req.body;

      let updatedSlug = existing.slug;
      if (updates.slug && updates.slug !== existing.slug) {
        updatedSlug = generateSlug(updates.slug);
        // check duplicate
        if (products.some((p) => p.id !== existing.id && p.slug === updatedSlug)) {
          updatedSlug = `${updatedSlug}-${Date.now().toString().slice(-4)}`;
        }
      }

      const updatedProduct: Product = {
        ...existing,
        ...updates,
        id: existing.id,
        slug: updatedSlug,
        price: updates.price !== undefined ? Number(updates.price) : existing.price,
        discountPrice: updates.discountPrice !== undefined ? Number(updates.discountPrice) : existing.discountPrice,
        stockCount: updates.stockCount !== undefined ? Number(updates.stockCount) : existing.stockCount,
        updatedAt: new Date().toISOString(),
      };

      products[index] = updatedProduct;
      saveProducts(products);

      res.json(updatedProduct);
    } catch (err: any) {
      console.error('Error updating product:', err);
      res.status(500).json({ error: err.message || 'Failed to update product.' });
    }
  });

  // Delete Product (Admin Only)
  app.delete('/api/products/:id', checkAdminAuth, (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const products = getProducts();
      const filtered = products.filter((p) => p.id !== id && p.slug !== id);

      if (filtered.length === products.length) {
        return res.status(404).json({ error: 'Product not found.' });
      }

      saveProducts(filtered);
      res.json({ success: true, message: 'Product deleted successfully.' });
    } catch (err: any) {
      console.error('Error deleting product:', err);
      res.status(500).json({ error: err.message || 'Failed to delete product.' });
    }
  });

  // Upload Product Image (Admin Only)
  app.post('/api/upload', checkAdminAuth, (req: Request, res: Response) => {
    try {
      const { filename, base64Data } = req.body;
      if (!base64Data) {
        return res.status(400).json({ error: 'No image data provided.' });
      }

      // Parse data URL: e.g. data:image/jpeg;base64,....
      const matches = base64Data.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      let ext = 'jpg';
      let buffer: Buffer;

      if (matches) {
        ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(base64Data, 'base64');
      }

      const safeBaseName = (filename || 'product')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 30);
      const uniqueName = `${safeBaseName}_${Date.now()}.${ext}`;
      const targetPath = path.join(UPLOADS_DIR, uniqueName);

      fs.writeFileSync(targetPath, buffer);

      const publicUrl = `/uploads/${uniqueName}`;
      res.json({ success: true, url: publicUrl });
    } catch (err: any) {
      console.error('Upload error:', err);
      res.status(500).json({ error: 'Failed to upload image file.' });
    }
  });

  // Admin Auth - Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    const admin = getAdminData();

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const inputHash = crypto.createHash('sha256').update(password).digest('hex');

    if (
      email.toLowerCase().trim() === admin.email.toLowerCase().trim() &&
      inputHash === admin.passwordHash
    ) {
      const sessionToken = crypto.randomBytes(32).toString('hex');
      admin.tokens = admin.tokens || [];
      admin.tokens.push(sessionToken);
      // Keep only last 10 tokens
      if (admin.tokens.length > 10) {
        admin.tokens = admin.tokens.slice(-10);
      }
      saveAdminData(admin);

      return res.json({
        success: true,
        token: sessionToken,
        user: { email: admin.email, role: 'admin' },
      });
    }

    return res.status(401).json({ error: 'Invalid email or password.' });
  });

  // Admin Auth - Verify Token
  app.get('/api/auth/verify', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({ authenticated: false });
    }

    const token = authHeader.split(' ')[1];
    const admin = getAdminData();
    const isValid = Boolean(admin.tokens && admin.tokens.includes(token));

    res.json({ authenticated: isValid, email: isValid ? admin.email : null });
  });

  // Admin Auth - Change Password
  app.post('/api/auth/change-password', checkAdminAuth, (req: Request, res: Response) => {
    const { newPassword, newEmail } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const admin = getAdminData();
    admin.passwordHash = crypto.createHash('sha256').update(newPassword).digest('hex');
    if (newEmail && newEmail.includes('@')) {
      admin.email = newEmail.trim();
    }
    saveAdminData(admin);

    res.json({ success: true, message: 'Admin credentials updated successfully.' });
  });

  // --- Serve Frontend Application ---
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.use(vite.middlewares);

    // Fallback to index.html for all non-api routes (supporting /product/:slug, /admin, etc.)
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const templatePath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(templatePath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    // Production: serve built static files from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Trend Dropzz server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
