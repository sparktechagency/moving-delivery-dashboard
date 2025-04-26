function UsersTable() {
    const users = [
      { id: 1, name: "User", email: "user@example.com", date: "11 Jan 2024", accountType: "User" },
      { id: 2, name: "User", email: "user@example.com", date: "11 Jan 2024", accountType: "Admin" },
      { id: 3, name: "User", email: "user@example.com", date: "11 Jan 2024", accountType: "User" },
      { id: 4, name: "User", email: "user@example.com", date: "11 Jan 2024", accountType: "User" },
      { id: 5, name: "User", email: "user@example.com", date: "11 Jan 2024", accountType: "Admin" },
    ]
  
    return (
      <div className="overflow-x-auto">
        <div className="bg-[#4BADC9] flex justify-between text-white p-3 font-medium">
            <h1>Recent Users</h1>
            <h2>View All</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-[#3A9CB9]  text-gray-600">
            <tr className="bg-[#C9E6ED]">
              <th className="py-3 px-4 text-left font-medium">Serial</th>
              <th className="py-3 px-4 text-left font-medium">Name</th>
              <th className="py-3 px-4 text-left font-medium">Email</th>
              <th className="py-3 px-4 text-left font-medium">Date</th>
              <th className="py-3 px-4 text-left font-medium">Account Type</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className={index % 2 === 0 ? "bg-[#3A9CB9] " : "bg-[#3A9CB9] "}>
                <td className="py-3 px-4 text-white">{user.id}</td>
                <td className="py-3 px-4 text-white">{user.name}</td>
                <td className="py-3 px-4 text-white">{user.email}</td>
                <td className="py-3 px-4 text-white">{user.date}</td>
                <td className="py-3 px-4 text-white">{user.accountType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  
  export default UsersTable
  