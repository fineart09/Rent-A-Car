# Booking Logic Rules

Booking Overlap Rules:

* Prevent overlapping bookings
* Ignore cancelled bookings
* Booking dates are inclusive

Car Availability:

* Cars in maintenance cannot be booked
* Cars already picked up cannot be double-booked

Price Calculation:

* Calculate rental days automatically
* Apply dynamic pricing by date range
* Apply promotion pricing if available

Validation:

* end_date must be greater than start_date
* customer must exist
* car must exist and be available
