import { useCallback } from "react"
import { Box, Heading, Stack, Text } from "@/components/braid"
import { IconChevronRight } from "@/components/braid/icons"
import { cn } from "@/lib/utils"
import { enterPrototype } from "@/src/hooks/useAppNavigation"
import { DEFAULT_SEARCH } from "@/src/hooks/searchQuery"
import { FUTURE_VISION_DEFAULT_SEARCH } from "@/src/data/futureVisionPresets"
import {
  folderItems,
  getFolderLabel,
  LIBRARY_TITLE,
  rootItems,
  type LibraryFolderId,
  type LibraryItem,
} from "@/src/prototype/library"

interface PrototypeLibraryPageProps {
  folderId: LibraryFolderId | null
  onOpenFolder: (folder: LibraryFolderId) => void
  onGoToRoot: () => void
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 7.5C3 6.67 3.67 6 4.5 6H9.17L11 7.83H19.5C20.33 7.83 21 8.5 21 9.33V17.5C21 18.33 20.33 19 19.5 19H4.5C3.67 19 3 18.33 3 17.5V7.5Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  )
}

function PrototypeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 9h8M8 12h5M8 15h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function LibraryRow({
  item,
  onActivate,
}: {
  item: LibraryItem
  onActivate: () => void
}) {
  const isFolder = item.type === "folder"

  return (
    <button
      type="button"
      onClick={onActivate}
      className={cn(
        "group flex w-full items-center gap-4 rounded-xl border border-[#EAECF1] bg-white px-4 py-4 text-left",
        "transition-colors hover:border-[#1E47A9]/30 hover:bg-[#F5F8FF]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2",
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
          isFolder ? "bg-[#FFF4D6] text-[#B8860B]" : "bg-[#E8EEF9] text-[#1E47A9]",
        )}
      >
        {isFolder ? <FolderIcon /> : <PrototypeIcon />}
      </span>

      <span className="min-w-0 flex-1">
        <Text weight="strong" className="block text-[#2E3849]">
          {item.label}
        </Text>
        {item.description ? (
          <Text tone="secondary" className="mt-0.5 block text-sm">
            {item.description}
          </Text>
        ) : null}
      </span>

      <IconChevronRight
        className="h-5 w-5 shrink-0 text-[#697586] transition-transform group-hover:translate-x-0.5"
        aria-hidden
      />
    </button>
  )
}

export function PrototypeLibraryPage({
  folderId,
  onOpenFolder,
  onGoToRoot,
}: PrototypeLibraryPageProps) {
  const items = folderId ? folderItems[folderId] : rootItems
  const folderLabel = folderId ? getFolderLabel(folderId) : null

  const handleActivate = useCallback(
    (item: LibraryItem) => {
      if (item.type === "folder") {
        onOpenFolder(item.id)
        return
      }
      const search =
        item.id === "future-vision" ? FUTURE_VISION_DEFAULT_SEARCH : DEFAULT_SEARCH
      enterPrototype(
        item.id,
        search,
        item.id === "version-b"
          ? { platform: "desktop", vbState: "default" }
          : item.id === "future-vision"
            ? { platform: "desktop" }
            : undefined,
      )
    },
    [onOpenFolder],
  )

  return (
    <Box
      component="div"
      className="min-h-screen bg-gradient-to-b from-[#F0F4FA] via-[#F7F9FC] to-white"
    >
      <Box component="main" className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
        <Stack space="large">
          <Stack space="small">
            {folderId ? (
              <button
                type="button"
                onClick={onGoToRoot}
                className="inline-flex items-center gap-1 text-sm font-medium text-[#1E47A9] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2"
              >
                ← {LIBRARY_TITLE}
              </button>
            ) : null}

            <Heading level="1" className="text-[#2E3849]">
              {folderLabel ?? LIBRARY_TITLE}
            </Heading>

            {!folderId ? (
              <Text tone="secondary">
                Open a folder to browse concept testing, delivery, and future vision prototypes.
              </Text>
            ) : null}
          </Stack>

          <Stack space="small">
            {items.map((item) => (
              <LibraryRow
                key={item.type === "folder" ? item.id : item.id}
                item={item}
                onActivate={() => handleActivate(item)}
              />
            ))}
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}
