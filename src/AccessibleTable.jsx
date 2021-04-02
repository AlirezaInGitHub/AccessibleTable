import React from 'react';
import {useAccessibleTable} from './useAccessibleTable';
import './AccessibleTable.css';

const AccessibleTable = () => {
  const [ref] = useAccessibleTable('[tabIndex="-1"]', (el, isFocused) => {
    console.log(el.id, isFocused);
  });

  const rows = [...new Array(100)];

  return (
    <>
      <table ref={ref} tabIndex="0">
        <thead>
          <tr>
            <th>Description</th>
            <th>Stage</th>
            <th>Time</th>
            <th>More...</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p, inx) => (
            <tr id={inx} key={inx}>
              <td>{inx}</td>
              <td>
                <a id="col-1" tabIndex="-1" href="https://google.com">
                  Google
                </a>
                <a id="col-2" tabIndex="-1" href="https://amazon.com">
                  Amazon
                </a>
              </td>
              <td></td>
              <td>
                <a id="col-3" tabIndex="-1" href="https://google.com">
                  Apple
                </a>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <a tabIndex="-1" href="https://google.com">
                Apple
              </a>
            </td>
            <td>
              <a tabIndex="-1" href="https://amazon.com">
                Uber
              </a>
            </td>
            <td>T</td>
            <td>
              <a tabIndex="-1" href="https://amazon.com">
                Microsoft
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <button
        onClick={() => {
          const tr = document.createElement('tr');
          tr.innerHTML =
            '<td> <input type="text" /> </td> <td>S</td> <td>T</td> <td>M</td>';
          ref.current.tBodies[0].appendChild(tr);
        }}>
        Add
      </button>
    </>
  );
};

export {AccessibleTable};
