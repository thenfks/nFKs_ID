-- Update the redirect_uris for AyScroll to be more flexible
-- We add 'http://localhost' (to trigger the new any-port logic)
-- We add '*.vercel.app' (to trigger the new wildcard logic for previews)

update oauth_clients 
set redirect_uris = array_cat(redirect_uris, ARRAY['http://localhost', '*.vercel.app'])
where client_id = 'ayscroll';
