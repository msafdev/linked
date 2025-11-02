insert into storage.buckets
  (id, name, public)
values
  ('images', 'images', true)
on conflict
(id) do
update set public = excluded.public;

drop policy
if exists "Public read access for images" on storage.objects;
create policy "Public read access for images"
  on storage.objects for
select
  using (bucket_id = 'images');

drop policy
if exists "Authenticated users can upload images" on storage.objects;
create policy "Authenticated users can upload images"
  on storage.objects for
insert
  with check
  (bucket_id
= 'images' and auth.role
() = 'authenticated');

drop policy
if exists "Authenticated users can update images" on storage.objects;
create policy "Authenticated users can update images"
  on storage.objects for
update
  using (bucket_id = 'images'
and auth.role
() = 'authenticated')
  with check
(bucket_id = 'images' and auth.role
() = 'authenticated');

drop policy
if exists "Authenticated users can delete images" on storage.objects;
create policy "Authenticated users can delete images"
  on storage.objects for
delete
  using (bucket_id
= 'images' and auth.role
() = 'authenticated');
