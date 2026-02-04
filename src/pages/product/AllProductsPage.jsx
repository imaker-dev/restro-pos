import React, { useState } from "react";
import { Search, ChevronDown, Edit2, Trash2 } from "lucide-react";
import SmartTable from "../../components/SmartTable";
import PageHeader from "../../layout/PageHeader";

const SAMPLE_DATA = [
  {
    id: 1,
    warehouse: "Lavish Warehouse",
    store: "Electro Mart",
    productName: "Lenovo IdeaPad 3",
    productIcon: "💻",
    date: "24 Dec 2024",
    person: "James Kirwin",
    personColor: "bg-red-500",
  },
  {
    id: 2,
    warehouse: "Quaint Warehouse",
    store: "Quantum Gadgets",
    productName: "Beats Pro",
    productIcon: "🎧",
    date: "10 Dec 2024",
    person: "Francis Chang",
    personColor: "bg-blue-500",
  },
  {
    id: 3,
    warehouse: "Traditional Warehouse",
    store: "Prime Bazaar",
    productName: "Nike Jordan",
    productIcon: "👟",
    date: "27 Nov 2024",
    person: "Antonio Engle",
    personColor: "bg-yellow-500",
  },
  {
    id: 4,
    warehouse: "Cool Warehouse",
    store: "Gadget World",
    productName: "Apple Series 5 Watch",
    productIcon: "⌚",
    date: "18 Nov 2024",
    person: "Leo Kelly",
    personColor: "bg-blue-600",
  },
  {
    id: 5,
    warehouse: "Overflow Warehouse",
    store: "Volt Vault",
    productName: "Amazon Echo Dot",
    productIcon: "🔊",
    date: "06 Nov 2024",
    person: "Annette Walker",
    personColor: "bg-pink-500",
  },
  {
    id: 6,
    warehouse: "Nova Storage Hub",
    store: "Elite Retail",
    productName: "Sanford Chair Sofa",
    productIcon: "🪑",
    date: "25 Oct 2024",
    person: "John Weaver",
    personColor: "bg-indigo-600",
  },
  {
    id: 7,
    warehouse: "Retail Supply Hub",
    store: "Prime Mart",
    productName: "Red Premium Satchel",
    productIcon: "👜",
    date: "14 Oct 2024",
    person: "Gary Hennessy",
    personColor: "bg-blue-400",
  },
  {
    id: 8,
    warehouse: "EdgeWare Solutions",
    store: "NeoTech Store",
    productName: "Iphone 14 Pro",
    productIcon: "📱",
    date: "03 Oct 2024",
    person: "Eleanor Panek",
    personColor: "bg-slate-700",
  },
  {
    id: 9,
    warehouse: "North Zone Warehouse",
    store: "Urban Mart",
    productName: "Gaming Chair",
    productIcon: "🎮",
    date: "20 Sep 2024",
    person: "William Levy",
    personColor: "bg-blue-500",
  },
  {
    id: 10,
    warehouse: "Fulfillment Hub",
    store: "Travel Mart",
    productName: "Borealis Backpack",
    productIcon: "🎒",
    date: "10 Sep 2024",
    person: "Charlotte Klotz",
    personColor: "bg-red-500",
  },
];

export default function AllProductsPage() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredData = SAMPLE_DATA.filter(
    (item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.warehouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.store.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns = [
    {
      key: "warehouse",
      label: "Warehouse",
      sortable: true,
      render: (row) => <span className="text-slate-700">{row.warehouse}</span>,
    },
    {
      key: "store",
      label: "Store",
      sortable: true,
      render: (row) => <span className="text-slate-700">{row.store}</span>,
    },
    {
      key: "productName",
      label: "Product Name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <span className="text-lg">{row.productIcon}</span>
          <span className="text-slate-700 font-medium">{row.productName}</span>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (row) => <span className="text-slate-600">{row.date}</span>,
    },
    {
      key: "person",
      label: "Person",
      sortable: true,
      render: (row) => {
        const initials = row.person
          .split(" ")
          .map((n) => n[0])
          .join("");
        return (
          <div className="flex items-center gap-3">
            <div
              className={`h-8 w-8 rounded-full ${row.personColor} flex items-center justify-center text-white text-xs font-semibold`}
            >
              {initials}
            </div>
            <span className="text-slate-700">{row.person}</span>
          </div>
        );
      },
    },
    {
      key: "qty",
      label: "Qty",
      sortable: true,
      render: (row) => (
        <span className="text-slate-700 font-medium">{row.qty}</span>
      ),
    },
  ];

  const actions = [
    {
      label: "Edit",
      icon: Edit2,
      color: "slate",
      onClick: (row) => console.log("Edit:", row),
    },
    {
      label: "Delete",
      icon: Trash2,
      color: "slate",
      onClick: (row) => console.log("Delete:", row),
    },
  ];

  const handleSort = (column) => {
    const field = column.sortKey || column.key;
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <>
      <div className="space-y-6">
        <PageHeader title={"All Products"} />
        <div className="bg-white">
          {/* Header Section */}
          <div className="border-b border-slate-200">
            <div className="px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full form-input pl-10 pr-4 py-2"
                  />
                </div>

                {/* Filter Dropdowns */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded text-sm bg-white hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                      <option>Warehouse</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded text-sm bg-white hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                      <option>Store</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded text-sm bg-white hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                      <option>Product</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div>
            <SmartTable
              title=""
              totalcount={0}
              data={filteredData}
              columns={columns}
              actions={actions}
              selectable={true}
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={handleSort}
              currentPage={currentPage}
              pageSize={rowsPerPage}
            />
          </div>

          {/* Pagination Footer */}
          <div className=" px-6 py-4 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-700">Row Per Page</span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="appearance-none px-3 py-1 border border-slate-200 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span className="text-sm text-slate-700">Entries</span>
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 text-slate-600 hover:text-slate-900 text-sm">
                &lt;
              </button>
              <button
                onClick={() => setCurrentPage(1)}
                className={`px-3 py-1 rounded text-sm font-medium ${currentPage === 1 ? "bg-orange-500 text-white" : "text-slate-600 hover:text-slate-900"}`}
              >
                1
              </button>
              <button
                onClick={() => setCurrentPage(2)}
                className={`px-3 py-1 rounded text-sm font-medium ${currentPage === 2 ? "bg-orange-500 text-white" : "text-slate-600 hover:text-slate-900"}`}
              >
                2
              </button>
              <button
                onClick={() => setCurrentPage(3)}
                className={`px-3 py-1 rounded text-sm font-medium ${currentPage === 3 ? "bg-orange-500 text-white" : "text-slate-600 hover:text-slate-900"}`}
              >
                3
              </button>
              <span className="px-2 text-slate-600 text-sm">...</span>
              <button className="px-3 py-1 text-slate-600 text-sm hover:text-slate-900">
                15
              </button>
              <button className="px-2 py-1 text-slate-600 hover:text-slate-900 text-sm">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
