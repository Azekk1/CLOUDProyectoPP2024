# Use an official MySQL image as a base
FROM mysql:8.0

# Set the environment variables
ENV MYSQL_ROOT_PASSWORD=login
ENV MYSQL_DATABASE=login
ENV MYSQL_USER=myuser   
ENV MYSQL_PASSWORD=mypassword

# Copy the SQL file to create the database
COPY login.sql /docker-entrypoint-initdb.d/

# Expose the MySQL port
EXPOSE 3306

# Run the command to start the MySQL server
CMD ["mysqld"]