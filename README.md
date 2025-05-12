# React Supabase Auth Boiler Plate

This is a boiler plate project for a React app using Supabase Auth for user authentication

## Usage

### 1. - Clone this repository 

```bash
gh repo clone tome-ferreira/ReactSupabaseAuthBoilerPlate
```

### 2. - Install project dependencies 

Install the project dependencies using 

```bash
npm install
```

### 3. - Set up a Supabase project

Create a Supabase project on their [official web site](https://supabase.com/). Make sure to configure and activate Google 0Auth for this project 

### 4. - Set up enviromental variables 

In the sorce of the project create a `.env file` and add the following code:

```
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PROJECT_ANON_KEY
```

### 5. - Run the project

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

