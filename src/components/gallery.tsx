import { createRef, useEffect, type HTMLAttributes } from "preact/compat";
import { useSignal } from "@preact/signals";
import "./gallery.css";
import { updateModel } from "@/lib/store";

interface Props extends HTMLAttributes<HTMLDivElement> {
  id: string;
  mvId: string;
}

export default function Gallery(props: Props) {
  const { id, mvId, className, children, ...rest } = props;
  const _children = Array.isArray(children) ? children : [children];
  const activeIdx = useSignal<number | null>(null);
  const isLightboxActive = activeIdx.value !== null;

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
  }

  return (
    <>
      {isLightboxActive && (
        <div id={`${id}-lightbox`} class="lightbox" onClick={hideLightbox}>
          <button onClick={nextImg}>←</button>
          {_children[activeIdx.value!]}
          <button onClick={prevImg}>→</button>
          <button class="set-thumbnail" onClick={setThumbnail}>
            Set thumbnail
          </button>
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
