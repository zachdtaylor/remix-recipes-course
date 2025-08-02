# React Router Recipes

A modern, full-stack recipe management application built with React Router. Organize your recipes, manage your pantry, plan meals, and generate grocery lists all in one place.

## Features

- 🍳 **Recipe Management** - Create, edit, and organize your favorite recipes with ingredients and instructions
- 🗂️ **Pantry Organization** - Organize pantry items into custom shelves for easy inventory management
- 📅 **Meal Planning** - Add recipes to your meal plan with quantity multipliers
- 🛒 **Smart Grocery Lists** - Automatically generate shopping lists from your meal plans, excluding items you already have in your pantry
- 🔐 **Secure Authentication** - Magic link authentication system for seamless login
- 📸 **Recipe Images** - Upload and store images for your recipes
- 📱 **Responsive Design** - Beautiful, modern UI that works on desktop and mobile
- ⚡ **Fast Performance** - Server-side rendering with React Router for optimal user experience

## Tech Stack

- **Frontend**: React 18, React Router 7, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: React Router (full-stack)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Magic link email authentication
- **File Storage**: Local file storage for recipe images
- **Email**: Mailgun for sending magic links
- **Testing**: Playwright for end-to-end testing

## Getting Started

### Prerequisites

- Node.js 22.0.0 or higher
- PostgreSQL database
- Mailgun account (for email authentication)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd react-router-recipes
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables by creating a `.env` file:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
ORIGIN=http://localhost:3000
ENCRYPTION_SECRET_KEY=<your-encryption-secret-key>
AUTH_COOKIE_SECRET=<your-auth-cookie-secret>
MAILGUN_API_KEY=<your-mailgun-api-key>
MAILGUN_DOMAIN=<your-mailgun-domain>
MAGIC_LINK_SECRET=<your-magic-link-secret>
```

4. Set up the database:
```bash
npx prisma db push
npx prisma db seed
```

5. Start the development server:
```bash
npm run dev
```

Your application will be available at `http://localhost:3000`.

## Usage

### Recipe Management
- Create new recipes with ingredients, instructions, and cooking time
- Upload images for your recipes
- Search and filter your recipe collection
- Edit existing recipes

### Pantry Management
- Create custom shelves to organize your pantry items
- Add items to specific shelves
- Search through your pantry inventory
- Delete items and shelves as needed

### Meal Planning
- Add recipes to your meal plan with quantity multipliers
- View all recipes currently in your meal plan
- Clear your entire meal plan when needed

### Grocery Lists
- Automatically generate shopping lists from your meal plans
- The system intelligently excludes items you already have in your pantry
- See which recipes each grocery item is used in
- Check off items as you shop

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

This application includes Docker configuration for easy deployment:

```bash
# Build the Docker image
docker build -t react-router-recipes .

# Run the container
docker run -p 3000:3000 react-router-recipes
```

### Fly.io Deployment

The application is configured for deployment on Fly.io:

```bash
# Deploy to Fly.io
npm run deploy
```

### Other Platforms

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Railway

## Testing

Run end-to-end tests:

```bash
# Run tests
npm run test:e2e

# Run tests with UI
npm run test:e2e:ui
```

## Database Schema

The application uses the following main entities:

- **Users** - Authentication and user management
- **Recipes** - Recipe data with ingredients and instructions
- **Ingredients** - Individual ingredients for recipes
- **PantryShelves** - Custom shelves for organizing pantry items
- **PantryItems** - Individual items stored in pantry shelves

## License

This project is licensed under the MIT License.

---

Built with ❤️ using React Router and modern web technologies.
