-- Remove the "letters" (Благодарственные письма) feature entirely: the admin
-- section had no live public consumer (HomeReviews, the only component that
-- read it, was never mounted after the homepage redesign).
DROP TABLE "letters";
