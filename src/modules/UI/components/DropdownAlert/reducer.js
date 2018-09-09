// @flow

import type { Action } from '../../../ReduxTypes.js'

const initialState = {
  visible: false,
  type: '',
  title: '',
  message: ''
}

type DropdownAlertState = {
  visible: boolean,
  type: string,
  title: string,
  message: string
}

export const dropdownAlert = (state: DropdownAlertState = initialState, action: Action) => {
  const { type, data = {} } = action
  switch (type) {
    case 'DROPDOWN_ALERT/DISPLAY_DROPDOWN_ALERT': {
      const { type, title, message } = data

      return {
        visible: true,
        type,
        title,
        message
      }
    }

    case 'DROPDOWN_ALERT/DISMISS_DROPDOWN_ALERT':
      return initialState

    default:
      return state
  }
}

export default dropdownAlert
