import React, { useState } from "react";
import { Plus, Edit, Trash2, Search, ArrowUp } from "lucide-react";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";

interface AllowanceItem {
  id: string;
  jabatan: string;
  zona1: string;
  zona2: string;
  zona3: string;
  zona4: string;
  zona5: string;
  zona6: string;
  zona7: string;
  zona8: string;
  zona9: string;
  zona10: string;
  isEditing?: boolean; // New field to track editing state
}

const initialData: AllowanceItem[] = [
  {
    id: "1",
    jabatan: "Manager",
    zona1: "200.000",
    zona2: "210.000",
    zona3: "220.000",
    zona4: "230.000",
    zona5: "240.000",
    zona6: "250.000",
    zona7: "260.000",
    zona8: "270.000",
    zona9: "280.000",
    zona10: "290.000",
    isEditing: false,
  },
  {
    id: "2",
    jabatan: "Ass. Manager",
    zona1: "180.000",
    zona2: "190.000",
    zona3: "200.000",
    zona4: "210.000",
    zona5: "220.000",
    zona6: "230.000",
    zona7: "240.000",
    zona8: "250.000",
    zona9: "260.000",
    zona10: "270.000",
    isEditing: false,
  },
  {
    id: "3",
    jabatan: "Staff/Engineer",
    zona1: "150.000",
    zona2: "160.000",
    zona3: "170.000",
    zona4: "180.000",
    zona5: "190.000",
    zona6: "200.000",
    zona7: "210.000",
    zona8: "220.000",
    zona9: "230.000",
    zona10: "240.000",
    isEditing: false,
  },
  {
    id: "4",
    jabatan: "Admin/Teknisi",
    zona1: "140.000",
    zona2: "150.000",
    zona3: "160.000",
    zona4: "170.000",
    zona5: "180.000",
    zona6: "190.000",
    zona7: "200.000",
    zona8: "210.000",
    zona9: "220.000",
    zona10: "230.000",
    isEditing: false,
  },
  {
    id: "5",
    jabatan: "Support(office boy, driver & kurir)",
    zona1: "110.000",
    zona2: "120.000",
    zona3: "130.000",
    zona4: "140.000",
    zona5: "150.000",
    zona6: "160.000",
    zona7: "170.000",
    zona8: "180.000",
    zona9: "190.000",
    zona10: "200.000",
    isEditing: false,
  },
  {
    id: "6",
    jabatan: "Direktur",
    zona1: "350.000",
    zona2: "360.000",
    zona3: "400.000",
    zona4: "420.000",
    zona5: "450.000",
    zona6: "480.000",
    zona7: "500.000",
    zona8: "520.000",
    zona9: "550.000",
    zona10: "600.000",
    isEditing: false,
  },
];

const MasterAllowancePage: React.FC = () => {
  const [allowanceData, setAllowanceData] =
    useState<AllowanceItem[]>(initialData);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<AllowanceItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newRowData, setNewRowData] = useState<AllowanceItem | null>(null);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    id: string
  ) => {
    const { name, value } = e.target;
    setAllowanceData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [name]: value } : item))
    );
  };

  const handleNewRowInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewRowData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleAddClick = () => {
    // Only allow adding a new row if there isn't one already being added
    if (!newRowData) {
      const newId = String(
        Math.max(...allowanceData.map((item) => Number(item.id))) + 1 || 1
      );
      setNewRowData({
        id: newId,
        jabatan: "",
        zona1: "",
        zona2: "",
        zona3: "",
        zona4: "",
        zona5: "",
        zona6: "",
        zona7: "",
        zona8: "",
        zona9: "",
        zona10: "",
        isEditing: true,
      });
    }
  };

  const handleEditClick = (item: AllowanceItem) => {
    setAllowanceData((prev) =>
      prev.map(
        (a) =>
          a.id === item.id
            ? { ...a, isEditing: true }
            : { ...a, isEditing: false } // Only one row can be edited at a time
      )
    );
    setEditingRowId(item.id);
  };

  const handleSaveClick = (item: AllowanceItem) => {
    setAllowanceData((prev) =>
      prev.map((a) => (a.id === item.id ? { ...a, isEditing: false } : a))
    );
    setEditingRowId(null);
  };

  const handleCancelEdit = (item: AllowanceItem) => {
    // Revert changes for the edited item or remove the new item
    if (item.id === newRowData?.id) {
      setNewRowData(null); // Remove the unsaved new row
    } else {
      setAllowanceData(
        (prev) =>
          prev.map((a) =>
            a.id === item.id
              ? ({
                  ...initialData.find((d) => d.id === item.id),
                  isEditing: false,
                } as AllowanceItem)
              : a
          ) // Revert to original data
      );
    }
    setEditingRowId(null);
  };

  const handleSaveNewRow = () => {
    if (newRowData) {
      setAllowanceData((prev) => [
        {
          ...newRowData,
          isEditing: false,
        },
        ...prev,
      ]);
      setNewRowData(null);
    }
  };

  const handleDeleteClick = (item: AllowanceItem) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setAllowanceData((prev) =>
        prev.filter((item) => item.id !== itemToDelete.id)
      );
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const filteredAllowance = allowanceData.filter((item) =>
    item.jabatan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Master Allowance</h1>
        <button
          onClick={handleAddClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add Allowance</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Jabatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jabatan
                </th>
                {[...Array(10)].map((_, i) => (
                  <th
                    key={i}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Zona {i + 1}
                  </th>
                ))}
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {newRowData && (
                <tr key={newRowData.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <input
                      type="text"
                      name="jabatan"
                      value={newRowData.jabatan}
                      onChange={handleNewRowInputChange}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    />
                  </td>
                  {[...Array(10)].map((_, i) => (
                    <td
                      key={i}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      <input
                        type="text"
                        name={`zona${i + 1}`}
                        value={
                          newRowData[`zona${i + 1}` as keyof AllowanceItem]
                        }
                        onChange={handleNewRowInputChange}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                      />
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      onClick={handleSaveNewRow}
                      className="text-green-600 hover:text-green-900"
                    >
                      <ArrowUp size={18} />
                    </button>
                    <button
                      onClick={() => setNewRowData(null)}
                      className="text-red-600 hover:text-red-900 ml-2"
                    >
                      X
                    </button>
                  </td>
                </tr>
              )}
              {filteredAllowance.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.isEditing ? (
                      <input
                        type="text"
                        name="jabatan"
                        value={item.jabatan}
                        onChange={(e) => handleInputChange(e, item.id)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                      />
                    ) : (
                      item.jabatan
                    )}
                  </td>
                  {[...Array(10)].map((_, i) => (
                    <td
                      key={i}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {item.isEditing ? (
                        <input
                          type="text"
                          name={`zona${i + 1}`}
                          value={item[`zona${i + 1}` as keyof AllowanceItem]}
                          onChange={(e) => handleInputChange(e, item.id)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        />
                      ) : (
                        item[`zona${i + 1}` as keyof AllowanceItem]
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    {item.isEditing ? (
                      <>
                        <button
                          onClick={() => handleSaveClick(item)}
                          className="text-green-600 hover:text-green-900 mr-2"
                        >
                          <ArrowUp size={18} />
                        </button>
                        <button
                          onClick={() => handleCancelEdit(item)}
                          className="text-red-600 hover:text-red-900"
                        >
                          X
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.jabatan}
      />
    </div>
  );
};

export default MasterAllowancePage;
