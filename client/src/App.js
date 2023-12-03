import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './Pages/Home'
import EditorPage from './Pages/EditorPage'
import {Toaster} from 'react-hot-toast'
import Editor from './components/Editor';
function App() {
  return (
    <>
      <div>
        <Toaster 
          position='top-right'
          toastOptions={
            {
              success: {
                theme:{
                  primary: 'rgb(65, 116, 255)'
                }
              }
            }
          }
        >
        </Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/editor/:roomId' element={<EditorPage/>}/>
          <Route path='/editor' element={<Editor/>}/>
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
