# E-commerce Web — Next.js

Sutain Buyant-ийн E-commerce даалгаварт зориулсан Next.js вэб сайт.

## Ашигласан технологиуд

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** — стайл
- **Zustand** — глобал стейт (сагс, нэвтрэлт)
- **TanStack Query** — серверийн өгөгдөл авах, кэш хийх
- **React Hook Form + Zod** — форм validation
- **Axios** — HTTP client
- **js-cookie** — token хадгалах
- **Lucide React** — иконууд

## Хэрэгжүүлсэн хуудсууд

| Хуудас | URL |
|--------|-----|
| Нүүр (ангилал + шинэ бараа) | `/` |
| Бүтээгдэхүүний жагсаалт | `/products` |
| Бүтээгдэхүүний дэлгэрэнгүй | `/products/[id]` |
| Сагс | `/cart` |
| Захиалга хийх | `/checkout` |
| Нэвтрэх | `/login` |
| Бүртгүүлэх | `/register` |
| Миний захиалгууд | `/orders` |
| Захиалгын дэлгэрэнгүй | `/orders/[id]` |
| Профайл | `/profile` |

## Суулгах заавар

```bash
# Хамаарлууд суулгах
npm install

# .env.local файл үүсгэх (аль хэдийн байна)
# NEXT_PUBLIC_API_URL=https://job.sutainbuyant.com/api/v1

# Development server ажиллуулах
npm run dev

# Production build
npm run build
npm start
```

## Онцлогууд

- **SEO**: `generateMetadata` ашиглан бүтээгдэхүүн бүрт dynamic meta tag
- **Skeleton loading**: бүтээгдэхүүн ачаалах үед харагдах animation
- **Dark mode**: системийн тохиргооноос автоматаар
- **Responsive**: mobile-first дизайн
- **Cart**: `localStorage`-д хадгалагдана, refresh хийхэд алдагддаггүй
- **Token**: `js-cookie`-д хадгалагдана (httpOnly биш, гэхдээ SameSite: strict)
- **422 validation**: checkout дахь validation алдааг талбар бүрийн доор харуулна
- **Filter URL sync**: шүүлтүүрийн утгууд URL query параметрт хадгалагдана

## API

Base URL: `https://job.sutainbuyant.com/api/v1`

Bearer token авах: `POST /login` эсвэл `POST /register`
