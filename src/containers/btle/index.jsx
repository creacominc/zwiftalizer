import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import structure from '../../styles/structure.css'
import {Chart} from './chart.jsx'

class Btle extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {isLoaded} = this.props
    return isLoaded
      ? this.renderChart()
      : null
  }

  renderChart() {

    const {messages} = this.props

    if (messages && messages.count()) {
      return (
        <div className="container">
          <Chart data={this.props}/>
        </div>        
      )
    }

    return (null)      
  }
}

function mapStateToProps(state) {
  const {reader, btle} = state
  return {
    ...reader,
    ...btle
  }
}

Btle.propTypes = {
  reader: PropTypes.object,
  btle: PropTypes.object
}

export default connect(mapStateToProps)(Btle)
