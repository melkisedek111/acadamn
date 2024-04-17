import Image from 'next/image'
import React from 'react'

const Spinner = () => {
  return (
    <div className="mt-52 flex items-center justify-center">
        <Image src="/spinner.svg" alt="spinner" width={100} height={100} />
    </div>
  )
}

export default Spinner