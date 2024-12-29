export const UsersCart = ({ showUser, users }) => {
  return (
    <>
      {showUser && (
        <>
          <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
          <section className="mb-6 overflow-x-auto">
            <table className="w-full bg-white shadow-md rounded-lg dark:bg-gray-800 ">
              <thead className="bg-gray-200 dark:bg-gray-500">
                <tr>
                  <th className="p-2">No.</th>

                  <th className="p-2">Name</th>
                  <th className="p-2">phone</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody className="">
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td className="p-2">#{index + 1}</td>
                    <td className="p-2">{user.fullName}</td>
                    <td className="p-2 hover:text-blue-600">
                      <a href={`tel:+${user.phoneNumber}`}>
                        {" "}
                        {user.phoneNumber}
                      </a>
                    </td>
                    <td className="p-2 hover:text-blue-600">
                      <a href={`mailto:${user.email}`}> {user.email}</a>
                    </td>
                    <td className="p-2">{user.role}</td>
                    <td className="p-2 flex space-x-2">
                      <button
                        className="bg-red-500 text-white px-4 py-1 rounded"
                        onClick={() => handleUserDelete(user._id)}
                      >
                        Delete
                      </button>
                      {user.role !== "ADMIN" && (
                        <button
                          className="bg-blue-500 text-white px-4 py-1 rounded"
                          onClick={() => handlePromoteToAdmin(user._id)}
                        >
                          Promote
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </>
  );
};
