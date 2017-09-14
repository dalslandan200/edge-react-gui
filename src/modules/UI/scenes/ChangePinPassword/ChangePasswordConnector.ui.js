import { connect } from 'react-redux'
import * as CORE_SELECTORS from '../../../Core/selectors.js'
import { Actions } from 'react-native-router-flux'
import ChangePasswordComponent from './ChangePasswordComponent.ui'

export const mapStateToProps = (state) => {
  return {
    context: CORE_SELECTORS.getContext(state),
    accountObject: CORE_SELECTORS.getAccount(state)
  }
}

export const mapDispatchToProps = () => {
  return {
    onComplete: () => Actions['settingsOverview']()
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordComponent)
