import {useState, useRef, useLayoutEffect, useEffect} from 'react';

const FOCUSED_DATA_KEY = 'isFocused';

const focusNextItem = (collection, itemIndex, stateSetter, focusChanged) => {
  if (collection.length == 0 || collection.length == itemIndex + 1) return;
  if (itemIndex == -1) {
    const el = collection[0];
    el.dataset[FOCUSED_DATA_KEY] = '';
    el.focus();
    focusChanged && focusChanged(el, true);
    stateSetter(0);
    return;
  }
  delete collection[itemIndex].dataset[FOCUSED_DATA_KEY];
  focusChanged && focusChanged(collection[itemIndex], false);

  const el = collection[itemIndex + 1];
  el.focus();
  el.dataset[FOCUSED_DATA_KEY] = '';
  focusChanged && focusChanged(el, true);
  stateSetter((currIndex) => currIndex + 1);
  if (!isInView(el)) {
    el.scrollIntoView();
  }
};

const focusPreItem = (collection, itemIndex, stateSetter, focusChanged) => {
  if (collection.length == 0 || itemIndex < 1) return;
  delete collection[itemIndex].dataset[FOCUSED_DATA_KEY];
  focusChanged && focusChanged(collection[itemIndex], false);
  const el = collection[itemIndex - 1];
  el.dataset[FOCUSED_DATA_KEY] = '';
  el.focus();
  focusChanged && focusChanged(el, true);
  stateSetter((currIndex) => currIndex - 1);
  if (!isInView(el)) {
    el.scrollIntoView();
  }
};

const focusItem = (collection, itemIndex, stateSetter, focusChanged) => {
  if (collection.length == 0 || itemIndex < 1) return;
  const el = collection[itemIndex];
  el.dataset[FOCUSED_DATA_KEY] = '';
  el.focus();
  focusChanged && focusChanged(el, true);
  stateSetter(itemIndex);
};

const useAccessibleTable = (querySelectorInRow, focusChanged) => {
  const ref = useRef();

  const [focusedRowIndex, setFocusedRowIndex] = useState(-1);
  const [focusedItemIndex, setFocusedItemIndex] = useState(-1);

  const clearItemFocus = (
    collection,
    itemIndex,
    setFocusedItemStateSetter,
    focusChanged,
  ) => {
    if (itemIndex != -1) {
      const el = collection[itemIndex];
      delete el.dataset[FOCUSED_DATA_KEY];
      focusChanged && focusChanged(el, false);
    }
    setFocusedItemStateSetter(-1);
    ref.current.focus();
  };

  // 'useEffect' could be working enough if combination of keys was not expected to be pressed.
  // For combined key-down events, we need to respond synchronously.
  // Otherwise, we'll face stalled closure.
  useLayoutEffect(() => {
    if (!ref.current) return;
    const rows = [...ref.current.tBodies[0].querySelectorAll('tr')];
    var rowFocusableItems = [];

    if (focusedRowIndex != -1) {
      rowFocusableItems =
        ref.current.tBodies[0].rows[focusedRowIndex].querySelectorAll(
          querySelectorInRow,
        );
    }

    ref.current.onclick = (e) => {
      const row = e
        .composedPath()
        .find((el) => el.nodeName.toLowerCase() == 'tr');

      const rowIndex = rows.indexOf(row);
      clearItemFocus(rows, focusedRowIndex, setFocusedItemIndex, focusChanged);
      clearItemFocus(
        rowFocusableItems,
        focusedItemIndex,
        setFocusedItemIndex,
        focusChanged,
      );
      focusItem(rows, rowIndex, setFocusedRowIndex, focusChanged);
    };
    ref.current.onkeydown = (k) => {
      if (k.code == 'ArrowUp' || k.code == 'ArrowDown') {
        k.preventDefault();
        const func = k.code == 'ArrowUp' ? focusPreItem : focusNextItem;
        clearItemFocus(
          rowFocusableItems,
          focusedItemIndex,
          setFocusedItemIndex,
          focusChanged,
        );
        func(rows, focusedRowIndex, setFocusedRowIndex, focusChanged);
      } else if (k.code == 'ArrowRight' || k.code == 'ArrowLeft') {
        k.preventDefault();
        const func = k.code == 'ArrowRight' ? focusNextItem : focusPreItem;
        func(
          rowFocusableItems,
          focusedItemIndex,
          setFocusedItemIndex,
          focusChanged,
        );
      }
    };
  }, [ref, focusedRowIndex, focusedItemIndex]);
  return [ref];
};

function isInView(el) {
  const box = el.getBoundingClientRect();
  return box.top < window.innerHeight && box.bottom >= 0;
}

export {useAccessibleTable};
