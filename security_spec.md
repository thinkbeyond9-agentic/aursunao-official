# Security Specification: Aur Sunao

## Data Invariants
1. `User` documents: Accessible only by the owner (uid matching request.auth.uid).
2. `SavedPreset` documents: Accessible only by the owner (parent userId matching request.auth.uid).
3. `Story` documents: Users can read public stories and write their own stories.

## The "Dirty Dozen" Payloads (Examples)
1. Write to another user's `User` document.
2. Write to another user's `presets` subcollection.
3. Update `userId` field in `SavedPreset` to spoof ownership.
4. Update `createdAt` field in `Story` document.
5. Create `Story` document without `userId` field matching auth.
6. Create `Story` document with empty `content`.
7. List all users' `presets`.
8. Write junk to `name` field in `User`.
9. Create `SavedPreset` with `bpm` as a string.
10. Update `SavedPreset` with `name` as an empty string.
11. Attempt to set `email_verified` to `true` in `User` profile.
12. Attempt to write to `stories` subcollection without `createdAt`.
