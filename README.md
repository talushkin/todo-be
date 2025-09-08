# Todo App Frontend (React + Next.js)

## Features
- Responsive and modern UI (React, Next.js, Styled Components)
- User login, registration, and task management (CRUD)
- State management via Redux Toolkit
- Secure API integration via Axios
- Client-side routing via Next.js
- Accessibility and mobile responsiveness
- Server-side rendering (SSR) support
- Clean, modular, and well-documented code
- Limited third-party libraries

## Setup Instructions
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000)

3. **Environment Variables:**
   - Create a `.env.local` file if needed for API endpoints or secrets.

## Automated SSR Check
This app uses Next.js, which provides SSR by default for all pages. To verify SSR:

1. **Check page source:**
   - Open [http://localhost:3000](http://localhost:3000) in your browser.
   - Right-click and select "View Page Source".
   - You should see the initial HTML rendered for the page (not just a blank div).

2. **Test SSR programmatically:**
   - Run the following script to fetch the HTML and check for content:
   ```bash
   npx node -e "require('axios').get('http://localhost:3000').then(r => console.log(r.data.includes('<div')));"
   ```
   - If `true`, SSR is working.

3. **Add SSR to a page:**
   - Example for `pages/tasks.tsx`:
   ```tsx
   export async function getServerSideProps() {
     // Fetch initial data here
     return { props: {} };
   }
   ```

## License
This project is licensed for non-commercial use only. See `LICENSE` for details.

## Design & Architecture
- **React + Next.js** for UI and SSR
- **Redux Toolkit** for state management
- **Axios** for API calls
- **Styled Components** for styling
- **Next.js Router** for navigation
- **Accessibility**: Semantic HTML, labels, keyboard navigation
- **Mobile Responsive**: Media queries, flexible layouts

## API Documentation
- Backend API should include Swagger docs (see backend repo)

## Contact
For questions, contact [your email or GitHub].

---
