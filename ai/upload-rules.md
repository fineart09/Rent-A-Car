# File Upload Rules

Storage:

* Use UploadThing or S3

Supported Files:

* ID card image
* Driver license image
* Contract PDF

Validation:

* Max file size: 5MB
* Allowed types:

  * image/jpeg
  * image/png
  * application/pdf

Naming:

* Use unique generated filenames

Security:

* Validate MIME type
* Store secure URLs only
