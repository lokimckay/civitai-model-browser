import { useCallback, useEffect, type HTMLAttributes } from "preact/compat";
import { useSignal, computed } from "@preact/signals";
import { updateModel } from "@/lib/store";
import exifr from "exifr";
import "./gallery.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  id: string;
  mvId: string;
}

export default function Gallery(props: Props) {
  const { id, mvId, className, children, ...rest } = props;
  const _children = Array.isArray(children) ? children : [children];
  const activeIdx = useSignal<number | null>(null);
  const activeChild = computed(() =>
    activeIdx.value !== null ? _children[activeIdx.value] : null
  );

  const metadata = useSignal<any | null>(null);
  const userComment = useSignal<string | null>(null);
  const isLightboxActive = activeIdx.value !== null;

  const getTags = useCallback(async () => {
    if (!activeChild.value) return;
    const url = activeChild.value.props.src;
    const tags = await exifr.parse(url, true);
    metadata.value = tags;

    const arr = metadata.value?.["userComment"];
    const decoded = arr && new TextDecoder().decode(arr);
    const pruned = decoded?.replace(/[^ -~]+/g, "").replace("UNICODE", "");
    const split = pruned
      ?.split("Negative prompt: ")
      .join("\n\nNegative prompt: ")
      .split("Steps: ")
      .join("\n\nSteps: ")
      .split("Sampler: ")
      .join("\nSampler: ")
      .split("CFG scale: ")
      .join("\nCFG scale: ")
      .split("Seed: ")
      .join("\nSeed: ")
      .split("Size: ")
      .join("\nSize: ")
      .split("Model hash: ")
      .join("\nModel hash: ");
    userComment.value = arr ? split : null;
  }, [activeChild.value, isLightboxActive]);

  useEffect(() => {
    getTags();
  }, [getTags]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (!isLightboxActive) return;
      if (event.key === "ArrowLeft") prevImg();
      if (event.key === "ArrowRight") nextImg();
      if (event.key === "Escape") activeIdx.value = null;
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [isLightboxActive]);

  function showLightbox(idx: number) {
    return (_event: Event) => {
      activeIdx.value = idx;
    };
  }

  function hideLightbox(event: Event) {
    if (event.target === event.currentTarget) activeIdx.value = null;
  }

  function nextImg() {
    activeIdx.value = (activeIdx.value! + 1) % _children.length;
  }

  function prevImg() {
    activeIdx.value =
      (activeIdx.value! - 1 + _children.length) % _children.length;
  }

  function setThumbnail() {
    updateModel({ id: mvId, previewIdx: activeIdx.value! });
    activeIdx.value = null;
  }

  return (
    <>
      {isLightboxActive && (
        <div id={`${id}-lightbox`} class="lightbox" onClick={hideLightbox}>
          <button onClick={prevImg}>←</button>
          {activeChild}
          <button onClick={nextImg}>→</button>
          <button class="set-thumbnail" onClick={setThumbnail}>
            Set thumbnail
          </button>
          {userComment.value && (
            <div class="metadata">
              <textarea readOnly>{userComment.value}</textarea>
            </div>
          )}
        </div>
      )}
      <div id={`${id}-gallery`} class={`gallery ${className}`} {...rest}>
        {(_children || []).map((child, idx) => {
          const key = child.key || idx;
          return (
            <div class="gallery-item" key={key} onClick={showLightbox(idx)}>
              {child}
            </div>
          );
        })}
      </div>
    </>
  );
}
