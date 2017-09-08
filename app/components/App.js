import React, { Component } from 'react'
import { clone, fill, head } from 'lodash'
import { Button } from 'react-bootstrap'
import Cell from './Cell'
import { isCellBeingSelected, clearBaseCell } from '../helpers'

const defautlState = () => ({
  selectedStart: false,
  startRow: null,
  startColumn: null,
  endRow: null,
  endColumn: null,
  hasSelected: false
})

const defautlCell = (value) => ({
  value,
  selected: null,
  change: null,
  hasCell: [],
  params: null,
  hide: false
})

class Table extends Component { 
  state = {
    value: [
      [ defautlCell(1), defautlCell(1), defautlCell(0), defautlCell(1) ],
      [ defautlCell(1), defautlCell(1), defautlCell(0), defautlCell(1) ],
      [ defautlCell(1), defautlCell(1), defautlCell(0), defautlCell(1) ],
      [ defautlCell(1), defautlCell(1), defautlCell(0), defautlCell(1) ] 
    ],
    ...defautlState()
  }
  componentDidMount() {
    window.addEventListener('mouseup', this.mouseEndTouch)
    window.addEventListener('click', this.handleClick)
  }
  componentWillUnmount() {
    window.removeEventListener('mouseup', this.mouseEndTouch)
  }
  mouseStartMove = (state) => {
    this.setState({...state})
  }
  mouseMove = (state) => {
    this.setState({...state})
  }
  handleClick = (e) => {
    if (e.target.tagName !== 'TD' && e.target.tagName !== 'TR' && e.target.tagName !== 'TBODY' && this.state.hasSelected) {
      this.setDefaultState()
    }
  }
  mouseEndTouch = (e) => {
    const { startColumn, endColumn, startRow, endRow } = this.state
    const isLeftClick = e.button === 0
    const isTouch = e.type !== 'mousedown'
    if (this.state.selectedStart && (isLeftClick || isTouch)) {
      const minRow = Math.min(startRow, endRow)
      const maxRow = Math.max(startRow, endRow)
      const minColumn = Math.min(startColumn, endColumn)
      const value = clone(this.state.value)
      const maxColumn = Math.max(startColumn, endColumn)
      for (let row = minRow; row <= maxRow; row++) {
        for (let column = minColumn; column <= maxColumn; column++) {
          value[row][column].selected = true
        }
      }
      this.setState({ selectedStart: false, value, hasSelected: true })
    }
  }
  changeText = (row, column) => {
    const value = clone(this.state.value)
    value[row][column].change = true
    this.setState({ value })
  }
  updateValue = (row, column, text) => {
    const value = clone(this.state.value)
    value[row][column].value = text
    this.setState({ value })
  }
  setDefaultState = () => {
    const value = clone(this.state.value)
    const defaultValue = value.map(row => row.map(column => ({ ...column, selected: false, change: false })))
    this.setState({ value: defaultValue, ...defautlState()})
  }
  addColumn = () => {
    const value = clone(this.state.value)
    value.forEach(row => row.push(defautlCell(3)))  
    this.setState({ value })
  }
  addRow = () => {
    const value = clone(this.state.value)
    value.push(fill(Array(head(value).length), defautlCell(3)))
    this.setState({ value })
  }
  splitCell = () => {
    const { startRow, startColumn, value } = this.state
    if((startRow !== null && startColumn !== null) && value[startRow][startColumn].hasCell.length > 0) {
      const cells = clone(this.state.value)
      cells[startRow][startColumn].params = null
      cells[startRow][startColumn].hasCell.forEach(pos => cells[pos.row][pos.column].hide = false)
      cells[startRow][startColumn].hasCell = []
      this.setState({ value: cells })
    }
  }
  joinCell = () => {
    const { startRow, endRow, startColumn, endColumn } = this.state
    const minRow = Math.min(startRow, endRow)
    const maxRow = Math.max(startRow, endRow)
    const minColumn = Math.min(startColumn, endColumn)
    const maxColumn = Math.max(startColumn, endColumn)
    const value = clone(this.state.value)
    const baseCell = value[minRow][minColumn].hasCell.length > 0 ? value[minRow][minColumn] : null
    if (baseCell && (baseCell.params.maxRow < maxRow || baseCell.params.maxColumn < maxColumn)) {
      baseCell.hasCell.forEach(pos => value[pos.row][pos.column].hide = false)
      baseCell.hasCell = []
    }
  
    if (baseCell && (minRow === maxRow && minColumn === maxColumn)) {
      return
    } 

    for (let row = minRow; row <= maxRow; row++) {
      for (let column = minColumn; column <= maxColumn; column++) {
        if (row > minRow || column > minColumn) {
          if (value[row][column].hasCell.length > 0) {
            value[row][column].params = null
            value[row][column].hasCell.forEach(pos => {
              value[pos.row][pos.column].hide = false
            })
            value[row][column].hasCell = []
          }
          value[minRow][minColumn].hasCell.push({ row, column })
          value[row][column].hide = true
        }
        if (column === maxColumn && maxRow === row) {
          value[minRow][minColumn].params = { maxRow, maxColumn, colSpan: (maxColumn - minColumn  ) + 1, rowSpan: (maxRow - minRow) + 1 }
        } 
      }
    }
    this.setState({ value })
  }
  render() {
    const { selectedStart } = this.state
    return (
      <div>
        <Button bsStyle="primary" onClick={this.addColumn}>Add column</Button>
        <Button bsStyle="primary" onClick={this.addRow}>Add row</Button>
        <Button bsStyle="primary" onClick={this.joinCell}>Join</Button>
        <Button bsStyle="primary" onClick={this.splitCell}>Split</Button>
        <table>
          <tbody>
            { 
              this.state.value.map((row, rowIndex) => (
                <tr key={rowIndex.toString()}>
                  { 
                    row.map((col, colIndex) => {
                      return col.hide ? null :
                        <Cell
                          key={colIndex.toString()}
                          row={rowIndex}
                          column={colIndex}
                          selectedStart={selectedStart}
                          mouseStartMove={this.mouseStartMove}
                          mouseMove={this.mouseMove}
                          changeText={this.changeText}
                          updateValue={this.updateValue}
                          setDefaultState={this.setDefaultState}
                          isCellBeingSelected={isCellBeingSelected({ row: rowIndex, column: colIndex, ...this.state })}
                          { ...col }
                        />
                      }
                    )
                  }
                </tr>
                )
              )  
            }
          </tbody>
        </table>  
      </div>
    )
  }
}

export default Table
