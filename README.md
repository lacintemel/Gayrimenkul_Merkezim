# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documengjtation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on howasdas to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

# Gayrimenkul Merkezim

## Proje Kurulumu

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
2. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

## Klasör Yapısı

- `src/components/` : Tekrar kullanılabilir arayüz bileşenleri
- `src/pages/` : Sayfa bileşenleri
- `src/layouts/` : Ortak layout bileşenleri
- `src/api/` : API servis dosyaları
- `src/store/` : Zustand ile global state yönetimi
- `src/utils/` : Yardımcı fonksiyonlar

## Test

- Testler için [Jest](https://jestjs.io/) ve [React Testing Library](https://testing-library.com/) kullanılabilir.
- Örnek test dosyaları: `src/pages/__tests__/Home.test.jsx`, `src/components/__tests__/Button.test.jsx`
- Test çalıştırmak için:
   ```bash
   npm test
   ```

## Geliştirme

- Gerçek API servisleri ile tam entegrasyon
- Kullanıcı rolleri ve yetkilendirme
- UI/UX için Tailwind ve component library
- Hata yönetimi ve güvenlik kontrolleri

## Katkı

Pull request ve issue açarak katkıda bulunabilirsiniz.
