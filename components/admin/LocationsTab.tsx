'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  MapPin, 
  Edit, 
  Trash2,
  Users,
  Building
} from 'lucide-react';

interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  status: 'active' | 'inactive';
  userCount: number;
  createdAt: string;
}

export function LocationsTab() {
  const [locations, setLocations] = useState<Location[]>([
    {
      id: '1',
      name: 'Main Clinic',
      address: '123 Main St, City, State 12345',
      phone: '+1 (555) 123-4567',
      status: 'active',
      userCount: 8,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'North Branch',
      address: '456 North Ave, City, State 12345',
      phone: '+1 (555) 123-4568',
      status: 'active',
      userCount: 4,
      createdAt: '2024-01-05T00:00:00Z'
    },
    {
      id: '3',
      name: 'South Branch',
      address: '789 South St, City, State 12345',
      phone: '+1 (555) 123-4569',
      status: 'inactive',
      userCount: 0,
      createdAt: '2024-01-10T00:00:00Z'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: ''
  });

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddLocation = () => {
    if (!formData.name || !formData.address || !formData.phone) return;

    const newLocation: Location = {
      id: Date.now().toString(),
      name: formData.name,
      address: formData.address,
      phone: formData.phone,
      status: 'active',
      userCount: 0,
      createdAt: new Date().toISOString()
    };

    setLocations([...locations, newLocation]);
    setFormData({ name: '', address: '', phone: '' });
    setShowAddModal(false);
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      address: location.address,
      phone: location.phone
    });
    setShowAddModal(true);
  };

  const handleUpdateLocation = () => {
    if (!editingLocation || !formData.name || !formData.address || !formData.phone) return;

    setLocations(locations.map(location =>
      location.id === editingLocation.id
        ? { ...location, ...formData }
        : location
    ));

    setEditingLocation(null);
    setFormData({ name: '', address: '', phone: '' });
    setShowAddModal(false);
  };

  const handleDeleteLocation = (locationId: string) => {
    setLocations(locations.filter(location => location.id !== locationId));
  };

  const handleToggleStatus = (locationId: string) => {
    setLocations(locations.map(location =>
      location.id === locationId
        ? { ...location, status: location.status === 'active' ? 'inactive' : 'active' }
        : location
    ));
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Locations</h2>
          <p className="text-gray-600">Manage clinic locations and branches</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Locations Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredLocations.map((location) => (
          <Card key={location.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-gray-600" />
                  <CardTitle className="text-lg">{location.name}</CardTitle>
                </div>
                <Badge className={getStatusColor(location.status)}>
                  {location.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <span className="text-sm text-gray-600">{location.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{location.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    {location.userCount} {location.userCount === 1 ? 'user' : 'users'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-xs text-gray-400">
                  Added {new Date(location.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditLocation(location)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(location.id)}
                    className={`h-8 w-8 p-0 ${
                      location.status === 'active' 
                        ? 'text-red-600 hover:text-red-700' 
                        : 'text-green-600 hover:text-green-700'
                    }`}
                  >
                    {location.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteLocation(location.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {editingLocation ? 'Edit Location' : 'Add New Location'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Location Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Main Clinic"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Address</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main St, City, State 12345"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingLocation(null);
                    setFormData({ name: '', address: '', phone: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={editingLocation ? handleUpdateLocation : handleAddLocation}
                >
                  {editingLocation ? 'Update' : 'Add'} Location
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

