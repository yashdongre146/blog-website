### Steps to Set Up and Run the Project

1. **Clone the Repository**  
   Download the project code from GitHub by cloning the repository to your local machine:

2. **Install Dependencies**  
   Run the following command to install the project dependencies:

   npm install

   This is necessary to ensure all required Node.js packages are installed according to the `package.json` file.

3. **Configure Environment Variables**  
   Create a `.env` file in the project's root directory. This file will store sensitive environment-specific configurations. Populate it with the following variables:

   SQL_DB_NAME=<your-database-name>
   SQL_DB_USER=<your-database-username>
   SQL_DB_PASSWORD=<your-database-password>
   SQL_DB_HOST=localhost
   JWT_SECRET=s0m3$ecur3R@nd0mK3y!f0rJWT$ign1ng
   PORT=3000

   - Ensure the database credentials match your local setup.
   - Replace the placeholders with actual values.

4. **Prepare the Database**  
   Ensure your local database is set up correctly:
   - Create the database if it does not exist.

5. **Run the Application**  
   Start the project using one of the following commands:
   npm start

   or

   node app.js

   This will launch the application, typically making it accessible on `http://localhost:3000`.

6. **Test the Setup**  
   - **Access the Application**: Open a web browser and navigate to the URL provided (e.g., `http://localhost:3000`) to verify that the application is running.
   - **Check API Endpoints**: If the project includes APIs, use tools like Postman or cURL to test key endpoints and ensure they are functioning as expected.
   - **Review Logs**: Monitor the console for any errors or warnings during startup or operation to address issues promptly.
