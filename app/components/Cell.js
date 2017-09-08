import React, { Component } from 'react';
import cls from 'classnames';
import '../style/main.css';

class Cell extends Component {
  handleMouseDown = (e) => {
    const { row, column, selectedStart, mouseStartMove, setDefaultState, change } = this.props;
    const isLeftClick = e.button === 0;
    if(!selectedStart && isLeftClick && !change) { 
      setDefaultState()
      e.preventDefault()
      mouseStartMove({
        selectedStart: true,
        startRow: row,
        startColumn: column,
        endRow: row,
        endColumn: column
      }) 
    }
  }
  handleMouseMove = (e) => {
    const { row, column, selectedStart, mouseMove } = this.props;
    if(selectedStart) {
      e.preventDefault()
      mouseMove({ endRow: row, endColumn: column })
    }
  }
  changeText = () => {
    this.props.changeText(this.props.row, this.props.column)
  }
  handleChange = (event) => {
    const { row, column, updateValue } = this.props
    updateValue(row, column, event.target.value)
  }
  render() {
    const { selected, value, isCellBeingSelected, change, params } = this.props
    return ( 
      <td
        width='100'
        height='40'
        className={cls({ selected, covered: isCellBeingSelected })}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onDoubleClick={this.changeText}
        rowSpan={ params ? params.rowSpan : 0 }
        colSpan={ params ? params.colSpan : 0 }
      >
        { change ? <input type="text" value={value} onChange={this.handleChange} /> : value }
      </td>
    );
  }
}

export default Cell
