

function TotalEarnings({ title, value, icon }) {
    return (
      <div className="bg-[#4BADC9] rounded-md p-4 flex items-center">
        <div className="bg-[#3A9CB9] p-2 rounded-full mr-3">{icon}</div>
        <div>
          <h3 className="text-sm font-medium text-white">{title}</h3>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    )
  }
  
  export default TotalEarnings
  
