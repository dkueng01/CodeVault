---
author: David Küng
pubDatetime: 2025-05-19T12:50:00Z
title: Understanding Next.js Through a Real-Life Example
slug: understanding-nextjs-through-real-life-example
featured: true
draft: false
tags:
  - React
  - Next.js
description: Explaining how Next.js works and what the benefits are
---

# Understanding Next.js Through a Real-Life Example
Have you ever visited a website that loads almost instantly, updates content without refreshing the page, and somehow still performs well in search engines? Chances are, you've experienced a Next.js application in action.

## What is Next.js?
Next.js is a React framework that gives you the building blocks to create web applications. Think of it as React with superpowers - it handles a lot of the complex configuration so you can focus on building your product.

## A Real-Life Example: Building an Online Bookstore
Let's imagine we're building "PageTurner," an online bookstore. Here's how Next.js would transform this project:

### Traditional React Approach
With plain React, our bookstore would be a client-side rendered application. When a customer visits PageTurner, their browser would:
1. Download a minimal HTML file
2. Download a large JavaScript bundle
3. Execute the JavaScript to render the page
4. Make API calls to fetch book data
5. Finally display the content

This approach has drawbacks - slow initial load times, poor SEO (search engines struggle with client-rendered content), and a subpar experience on slower devices.

### The Next.js Difference
With Next.js, our PageTurner bookstore would work differently:
```jsx
// pages/index.js - Our homepage
export default function Home({ featuredBooks }) {
  return (
    <div className="container">
      <h1>Welcome to PageTurner</h1>
      <div className="featured-books">
        {featuredBooks.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

// This function runs on the server before the page is sent to the browser
export async function getStaticProps() {
  const res = await fetch('https://api.pageturner.com/featured-books');
  const featuredBooks = await res.json();

  return {
    props: {
      featuredBooks
    },
    // Re-generate the page every hour
    revalidate: 3600
  };
}
```

When a customer visits PageTurner built with Next.js:
1. The server pre-renders the complete HTML with all book data already included
2. The browser displays a fully formed page immediately
3. Next.js then hydrates the page, making it interactive
4. As the user navigates, Next.js only fetches the data and components needed

### Key Next.js Features in Action
#### 1. Rendering Flexibility
For our book detail pages, we might want different rendering strategies:
1. Static Generation: For popular classics that rarely change, we pre-render at build time
2. Server-Side Rendering: For new releases where inventory changes frequently
3. Incremental Static Regeneration: For most books, generating pages on-demand and caching them

```jsx
// pages/books/[id].js
export default function BookDetail({ book }) {
  return (
    <div className="book-detail">
      <h1>{book.title}</h1>
      <p className="author">by {book.author}</p>
      <div className="price">${book.price}</div>
      <p>{book.description}</p>
      <button className="add-to-cart">Add to Cart</button>
    </div>
  );
}

// This decides which books get pre-rendered at build time
export async function getStaticPaths() {
  const popularBooks = await fetch('https://api.pageturner.com/popular-books');
  const books = await popularBooks.json();

  return {
    paths: books.map(book => ({ params: { id: book.id.toString() } })),
    fallback: 'blocking' // Generate other pages on-demand
  };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://api.pageturner.com/books/${params.id}`);
  const book = await res.json();

  return {
    props: { book },
    revalidate: 60 // Update the page every minute if requested
  };
}
```

#### 2. File-Based Routing
With Next.js, our site structure is intuitive:
- ```pages/index.js``` → Homepage (pageturner.com/)
- ```pages/books/index.js``` → All books page (pageturner.com/books)
- ```pages/books/[id].js``` → Individual book pages (pageturner.com/books/123)
- ```pages/cart.js``` → Shopping cart (pageturner.com/cart)

No complex router configuration needed!

#### 3. API Routes
We can build our own API endpoints right within the Next.js app:
```jsx
// pages/api/add-to-cart.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, bookId, quantity } = req.body;

  try {
    // Add to cart logic here
    await database.carts.add({ userId, bookId, quantity });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

## The User Experience Difference
For PageTurner customers, the Next.js version delivers:
1. Speed: Pages load instantly, even on mobile networks
2. Responsiveness: The UI updates immediately when adding books to cart
3. Reliability: Content appears even if JavaScript fails to load
4. Discoverability: Search engines can properly index all our books

## Why Developers Love Next.js
As a developer building PageTurner:
1. Productivity: The file-based routing and built-in API routes save hours of configuration
2. Performance: Automatic code splitting means we ship less code
3. Scalability: We can deploy to Vercel with zero configuration or use any Node.js server
4. Developer Experience: Fast Refresh updates the browser as we code without losing state

## Conclusion
Next.js isn't just another JavaScript framework—it's a complete solution for modern web applications. For our PageTurner bookstore, it means we can focus on creating a great book shopping experience rather than wrestling with technical challenges.
Whether you're building an e-commerce site, a blog, or a complex web application, Next.js provides the tools to deliver exceptional user experiences without sacrificing developer productivity.