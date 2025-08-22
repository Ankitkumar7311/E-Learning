import React from 'react'
let NavBar=()=>{
    return<>
     <nav className='bg-blue-50 h-25 flex flex-row justify-evenly items-center '>
        <a href=""><h1 className='text-xl font-semibold text-gray-800 font-sans-serif'>Mrs.College Guide</h1></a>
        <a href=""><h1 className='font-sans-serif ml-30 font-normal'>Universities</h1></a>
        <a href=""><h1 className='font-sans  '>Courses</h1></a>
        <a href=""><h1 className='font-sans'>Community</h1></a>
        <a href=""><h1 className='font-sans'>News</h1></a>
        <a href=""><h1 className='font-sans mr-30'>About</h1></a>
        <a href=""><h1 className='font-sans  font-bold uppercase'>Login</h1></a>
        <a href=""><h1 className='rounded-xs bg-yellow-500 h-8 w-24 content-center pl-5 pr-2 text-5 text-white uppercase hover:bg-yellow-600 shadow'>sign up</h1></a>
     </nav>
    </>

}
export default NavBar;