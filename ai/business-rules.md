# Business Rules

Cars:

* A car can only have one active booking at a time
* Cars statuses:

  * Available
  * Booked
  * In_Maintenance

Customers:

* Customer must upload:

  * Identification card image
  * Driver license image

Bookings:

* Booking statuses:

  * Pending
  * Confirmed
  * Completed
  * Cancelled

Booking Rules:

* Prevent overlapping bookings
* Exclude cancelled bookings from overlap checking
* Calculate total rental days automatically
* Calculate total price automatically

Payments:

* Payment statuses:

  * Success
  * Failed
  * Refunded

Payment Rules:

* Support dynamic pricing by date
* Support promotion pricing
* Store transaction history

Maintenance:

* Maintenance alerts trigger based on mileage
* Cars in maintenance cannot be booked

Reports:

* Financial reports are visible only to admin users

PDF Contracts:

* Generate PDF contracts automatically from booking and customer data
* Support print count limitation

Authentication:

* Role-based access control
* Roles:

  * Admin
  * Staff
  * add permission by roles
  * add is_deleted [true, false] by roles
