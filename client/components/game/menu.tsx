import React from 'react'

const Menu: React.FunctionComponent<{ visible: boolean}> = ({ visible }) => {
  return (
    <>
      {visible && (
        <div>
          Hello menu
        </div>
      )}
    </>
  )
}

export default Menu
