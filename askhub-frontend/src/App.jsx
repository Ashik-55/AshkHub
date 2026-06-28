import NavigationBar from "./components/layout/NavigationBar.jsx";
import CreatePost from "./features/Posts/CreatePost.jsx";
import Home from "./pages/Home.jsx";

function App() {
    return (
        <>
        <div className="bg-neutral-primary flex flex-col">
            <NavigationBar/>
            <CreatePost/>
        </div>
        </>
    );
}


export default App;