"use client"

import { createFilledIcon, createIcon } from "./icon-renderer"

// Navigation & Arrows
export const IconChevronDown = createIcon("IconChevronDown", <polyline points="6 9 12 15 18 9" />)

export const IconChevronUp = createIcon("IconChevronUp", <polyline points="18 15 12 9 6 15" />)

export const IconChevronLeft = createIcon("IconChevronLeft", <polyline points="15 18 9 12 15 6" />)

export const IconChevronRight = createIcon("IconChevronRight", <polyline points="9 18 15 12 9 6" />)

export const IconArrowLeft = createIcon(
  "IconArrowLeft",
  <>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </>,
)

export const IconArrowRight = createIcon(
  "IconArrowRight",
  <>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </>,
)

// Actions
export const IconSearch = createIcon(
  "IconSearch",
  <>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </>,
)

export const IconClear = createIcon(
  "IconClear",
  <>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </>,
)

export const IconClose = createIcon(
  "IconClose",
  <>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </>,
)

export const IconTick = createIcon("IconTick", <polyline points="20 6 9 17 4 12" />)

export const IconAdd = createIcon(
  "IconAdd",
  <>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </>,
)

export const IconMinus = createIcon("IconMinus", <line x1="5" y1="12" x2="19" y2="12" />)

export const IconDelete = createIcon(
  "IconDelete",
  <>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </>,
)

export const IconEdit = createIcon(
  "IconEdit",
  <>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </>,
)

export const IconCopy = createIcon(
  "IconCopy",
  <>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </>,
)

export const IconSettings = createIcon(
  "IconSettings",
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </>,
)

export const IconOverflow = createIcon(
  "IconOverflow",
  <>
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <circle cx="19" cy="12" r="1" fill="currentColor" />
    <circle cx="5" cy="12" r="1" fill="currentColor" />
  </>,
)

export const IconMenu = createIcon(
  "IconMenu",
  <>
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </>,
)

// Status & Feedback
export const IconPositive = createIcon(
  "IconPositive",
  <>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </>,
)

export const IconCritical = createIcon(
  "IconCritical",
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </>,
)

export const IconCaution = createIcon(
  "IconCaution",
  <>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </>,
)

export const IconInfo = createIcon(
  "IconInfo",
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </>,
)

export const IconPromote = createIcon(
  "IconPromote",
  <>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </>,
)

// UI Elements
export const IconVisibility = createIcon(
  "IconVisibility",
  <>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </>,
)

export const IconVisibilityOff = createIcon(
  "IconVisibilityOff",
  <>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </>,
)

export const IconLocation = createIcon(
  "IconLocation",
  <>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </>,
)

export const IconStar = createIcon(
  "IconStar",
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
)

export const IconStarFilled = createIcon(
  "IconStarFilled",
  <polygon
    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
    fill="currentColor"
  />,
)

export const IconHeart = createIcon(
  "IconHeart",
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
)

export const IconHeartFilled = createIcon(
  "IconHeartFilled",
  <path
    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
    fill="currentColor"
  />,
)

export const IconBookmark = createIcon("IconBookmark", <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />)

export const IconBookmarkFilled = createIcon(
  "IconBookmarkFilled",
  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="currentColor" />,
)

export const IconFilter = createFilledIcon(
  "IconFilter",
  <path
    d="M5 7.66667V4.16667C5 3.66667 4.66667 3.33333 4.16667 3.33333C3.66667 3.33333 3.33333 3.66667 3.33333 4.16667V7.66667C2.33333 8 1.66667 8.91667 1.66667 10C1.66667 11.0833 2.41667 12 3.33333 12.3333V15.8333C3.33333 16.3333 3.66667 16.6667 4.16667 16.6667C4.66667 16.6667 5 16.3333 5 15.8333V12.3333C6 12 6.66667 11.0833 6.66667 10C6.66667 8.91667 6 8 5 7.66667ZM4.16667 10.8333C3.66667 10.8333 3.33333 10.5 3.33333 10C3.33333 9.5 3.66667 9.16667 4.16667 9.16667C4.66667 9.16667 5 9.5 5 10C5 10.5 4.66667 10.8333 4.16667 10.8333ZM10.8333 11.8333V4.16667C10.8333 3.66667 10.5 3.33333 10 3.33333C9.5 3.33333 9.16667 3.66667 9.16667 4.16667V11.8333C8.16667 12.1667 7.5 13.0833 7.5 14.1667C7.5 15.5833 8.58333 16.6667 10 16.6667C11.4167 16.6667 12.5 15.5833 12.5 14.1667C12.5 13.0833 11.75 12.1667 10.8333 11.8333ZM10 15C9.5 15 9.16667 14.6667 9.16667 14.1667C9.16667 13.6667 9.5 13.3333 10 13.3333C10.5 13.3333 10.8333 13.6667 10.8333 14.1667C10.8333 14.6667 10.5 15 10 15ZM18.3333 5.83333C18.3333 4.41667 17.25 3.33333 15.8333 3.33333C14.4167 3.33333 13.3333 4.41667 13.3333 5.83333C13.3333 6.91667 14.0833 7.83333 15 8.16667V15.8333C15 16.3333 15.3333 16.6667 15.8333 16.6667C16.3333 16.6667 16.6667 16.3333 16.6667 15.8333V8.16667C17.5833 7.83333 18.3333 6.91667 18.3333 5.83333ZM15.8333 6.66667C15.3333 6.66667 15 6.33333 15 5.83333C15 5.33333 15.3333 5 15.8333 5C16.3333 5 16.6667 5.33333 16.6667 5.83333C16.6667 6.33333 16.3333 6.66667 15.8333 6.66667Z"
    fill="currentColor"
  />,
  "0 0 20 20",
)

/** Braid IconSort — parallel up/down arrows (20×20, seekJobs theme) */
export const IconSort = createFilledIcon(
  "IconSort",
  <path
    d="M9.75583 6.0775L7.25583 3.5775C7.09956 3.42127 6.88764 3.33351 6.66667 3.33351C6.4457 3.33351 6.23377 3.42127 6.0775 3.5775L3.5775 6.0775C3.49791 6.15437 3.43442 6.24633 3.39075 6.348C3.34707 6.44967 3.32409 6.55902 3.32312 6.66967C3.32216 6.78032 3.34325 6.89005 3.38515 6.99246C3.42705 7.09488 3.48893 7.18792 3.56717 7.26616C3.64541 7.34441 3.73846 7.40628 3.84087 7.44818C3.94328 7.49009 4.05302 7.51117 4.16367 7.51021C4.27432 7.50925 4.38367 7.48626 4.48534 7.44258C4.58701 7.39891 4.67896 7.33542 4.75583 7.25583L5.83333 6.17833V12.5C5.83333 12.721 5.92113 12.933 6.07741 13.0893C6.23369 13.2455 6.44565 13.3333 6.66667 13.3333C6.88768 13.3333 7.09964 13.2455 7.25592 13.0893C7.4122 12.933 7.5 12.721 7.5 12.5V6.17833L8.5775 7.25583C8.65471 7.33349 8.74651 7.39511 8.84762 7.43716C8.94873 7.47921 9.05716 7.50086 9.16667 7.50086C9.27617 7.50086 9.3846 7.47921 9.48571 7.43716C9.58682 7.39511 9.67862 7.33349 9.75583 7.25583C9.91206 7.09956 9.99982 6.88764 9.99982 6.66667C9.99982 6.4457 9.91206 6.23377 9.75583 6.0775ZM16.4225 12.7442C16.2662 12.5879 16.0543 12.5002 15.8333 12.5002C15.6124 12.5002 15.4004 12.5879 15.2442 12.7442L14.1667 13.8217V8.33333C14.1667 8.11232 14.0789 7.90036 13.9226 7.74408C13.7663 7.5878 13.5543 7.5 13.3333 7.5C13.1123 7.5 12.9004 7.5878 12.7441 7.74408C12.5878 7.90036 12.5 8.11232 12.5 8.33333V13.8217L11.4225 12.7442C11.3456 12.6646 11.2537 12.6011 11.152 12.5574C11.0503 12.5137 10.941 12.4908 10.8303 12.4898C10.7197 12.4888 10.61 12.5099 10.5075 12.5518C10.4051 12.5937 10.3121 12.6556 10.2338 12.7338C10.1556 12.8121 10.0937 12.9051 10.0518 13.0075C10.0099 13.11 9.98883 13.2197 9.98979 13.3303C9.99075 13.441 10.0137 13.5503 10.0574 13.652C10.1011 13.7537 10.1646 13.8456 10.2442 13.9225L12.7442 16.4225C12.8214 16.5002 12.9132 16.5618 13.0143 16.6038C13.1154 16.6459 13.2238 16.6675 13.3333 16.6675C13.4428 16.6675 13.5513 16.6459 13.6524 16.6038C13.7535 16.5618 13.8453 16.5002 13.9225 16.4225L16.4225 13.9225C16.5787 13.7662 16.6665 13.5543 16.6665 13.3333C16.6665 13.1124 16.5787 12.9004 16.4225 12.7442Z"
    fill="currentColor"
  />,
  "0 0 20 20",
)

/** @deprecated Use IconSort */
export const IconSortArrows = IconSort

// Social
export const IconShare = createIcon(
  "IconShare",
  <>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </>,
)

export const IconLink = createIcon(
  "IconLink",
  <>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </>,
)

export const IconExternalLink = createIcon(
  "IconExternalLink",
  <>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </>,
)

/** Opens in new window — used on Apply (SEEK job detail) */
export const IconNewWindow = createIcon(
  "IconNewWindow",
  <>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </>,
)

export const IconCategory = createIcon(
  "IconCategory",
  <>
    <path d="M4 7h16" />
    <path d="M4 12h10" />
    <path d="M4 17h6" />
    <circle cx="19" cy="17" r="2" />
  </>,
)

export const IconMail = createIcon(
  "IconMail",
  <>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </>,
)

export const IconPhone = createIcon(
  "IconPhone",
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />,
)

// Content
export const IconDocument = createIcon(
  "IconDocument",
  <>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </>,
)

export const IconImage = createIcon(
  "IconImage",
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </>,
)

export const IconDownload = createIcon(
  "IconDownload",
  <>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </>,
)

export const IconUpload = createIcon(
  "IconUpload",
  <>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </>,
)

export const IconPrint = createIcon(
  "IconPrint",
  <>
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </>,
)

// User & Profile
export const IconProfile = createIcon(
  "IconProfile",
  <>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </>,
)

export const IconCompany = createIcon(
  "IconCompany",
  <>
    <path d="M3 21h18" />
    <path d="M5 21V7l8-4v18" />
    <path d="M19 21V11l-6-4" />
    <path d="M9 9v.01" />
    <path d="M9 12v.01" />
    <path d="M9 15v.01" />
    <path d="M9 18v.01" />
  </>,
)

// Job specific
export const IconJob = createIcon(
  "IconJob",
  <>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </>,
)

export const IconSalary = createIcon(
  "IconSalary",
  <>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </>,
)

export const IconTime = createIcon(
  "IconTime",
  <>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </>,
)

export const IconCalendar = createIcon(
  "IconCalendar",
  <>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </>,
)

// Communication
export const IconChat = createIcon(
  "IconChat",
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
)

export const IconNotification = createIcon(
  "IconNotification",
  <>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </>,
)

export const IconHelp = createIcon(
  "IconHelp",
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </>,
)

// Re-export IconProps and IconRenderer for custom icons
export { type IconProps, createIcon } from "./icon-renderer"
