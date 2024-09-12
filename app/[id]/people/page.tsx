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
  {
    id: 3,
    name: "Name",
  },
  {
    id: 4,
    name: "Name",
  },
  {
    id: 5,
    name: "Name",
  },
  {
    id: 6,
    name: "Name",
  },
];

const page: React.FC = () => {
  return (
    <div className="p-4 grid grid-cols-3 gap-2">
      {people.map((item) => (
        <div
          className="relative w-full py-2 min-h-14 bg-gray-500/10 rounded flex gap-1 flex-col items-center justify-center"
          key={item.id}
        >
          <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-green-500"></span>
          <span className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center">
            {item.name.charAt(0).toUpperCase()}
          </span>
          <p className="text-xs">{item.name}</p>
        </div>
      ))}
    </div>
  );
};

export default page;
