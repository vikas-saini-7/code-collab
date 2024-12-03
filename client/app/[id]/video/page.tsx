import React from "react";

interface IPerson {
  id: number;
  name: string;
}

const people: IPerson[] = [
  {
    id: 1,
    name: "Name",
  },
  {
    id: 2,
    name: "Name",
  },
];

const page: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="mb-2">Video Chat</h1>
      <div className="flex items-center justify-center h-24 bg-gray-500/10 rounded-md">
        Join
      </div>

      <h2 className="mt-4 mb-2">Joined users: </h2>
      <div className="grid grid-cols-3 gap-2">
        {people.map((item) => (
          <div
            className="w-full py-2 min-h-14 bg-gray-500/10 rounded flex gap-1 flex-col items-center justify-center"
            key={item.id}
          >
            <span className="relative w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center">
              {item.name.charAt(0).toUpperCase()}
              <span className="absolute top-0 -right-1 w-[7px] h-[7px] rounded-full bg-green-500"></span>
            </span>
            <p className="text-xs">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
