# Flight Ticket Booking API Gateway


<h3>Introduction</h3>
<p>
    The Flights Booking Service is a critical microservice responsible for handling flight bookings in the Flight Ticket Booking system. It provides the necessary APIs to manage flight bookings, along with advanced features such as idempotency key for handling retries after successful payment, scheduled cron jobs for canceling old pending bookings, and a concurrent seat locking mechanism to ensure data consistency.
</p>


<h3>Design</h3>
<img src="/src/design.png" alt="project design"/>

<h3>Services</h3>
<ul>
<li>
<h4>
<a href="https://github.com/SanyamGoyal401/Flights-API-Gateway" target="_blank">Flights API Gateway Service</a></h4>
</li>
<li>
<h4>
<a href="https://github.com/SanyamGoyal401/Flights-Service" target="_blank">Flights Search Service</a></h4>
</li>
<li>
<h4>
<a href="https://github.com/SanyamGoyal401/Flights-Notification-Service" target="_blank">Flights Notification Service</a></h4>
</li>
</ul>

<h3>Features</h3>
<p>
<ol>
<li><p><b>Bookings CRUD:</b>Implements APIs to manage flight bookings, allowing users to create, read, update, and delete booking records.</p></li>
<li><p><b>Idempotency Key for Payment API: </b>Integrates idempotency key in the payment API to handle retries gracefully after successful payments and prevent duplicate bookings.</p></li>
<li><p><b>Scheduled Cron Jobs:</b>Sets up cron jobs to run every 15 minutes, checking and canceling old bookings that are still in a pending state, ensuring seat availability.</p></li>
<li><p><b>Concurrent Seat Locking Mechanism:</b>Utilizes SQL transactions and row-based locks to handle concurrent booking requests, preventing overbooking and maintaining data integrity.</p></li>
</ol>
</p>

<h3>Technologies Used</h3>
<ul>
<li>Node.js</li>
<li>Express.js</li>
<li>MySQL</li>
<li>Sequelize ORM</li>
</ul>

