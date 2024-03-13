// pages passes the currentUser to Baselayout and it  passes to the header
export default function BaseLayout({ children, currentUser }) {
    return (
        <div className="container">
            <Header currentUser={currentUser}></Header>
            {children}
        </div>
    );
}