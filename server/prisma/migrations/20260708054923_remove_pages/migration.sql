-- Remove the "pages" (Статические страницы) feature entirely: it had no live
-- public consumer — nothing on the site ever resolved a page by slug.
DROP TABLE "pages";
