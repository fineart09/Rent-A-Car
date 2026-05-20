# Server Action Rules

Rules:

* Return consistent response format
* Handle errors properly
* Validate input using Zod
* Never expose raw database errors

Response Format:
{
success: boolean,
message?: string,
data?: unknown,
error?: unknown
}

Use:

* try/catch
* typed responses
* centralized error handling
