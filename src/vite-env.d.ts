/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHARE_CONCEPT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
