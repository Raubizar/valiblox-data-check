
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Copy, Trash2 } from "lucide-react";

export const SavedNamingStandards = () => {
  const namingStandards = [
    {
      id: 1,
      name: "CAD Drawing Standard v2.1",
      project: "Office Building A - Phase 1",
      lastUsed: "2024-05-28",
      rulesCount: 12,
      category: "CAD",
    },
    {
      id: 2,
      name: "Document Control Standard",
      project: "Residential Complex B",
      lastUsed: "2024-05-27",
      rulesCount: 8,
      category: "Documents",
    },
    {
      id: 3,
      name: "Technical Specifications",
      project: "Infrastructure Project C",
      lastUsed: "2024-05-20",
      rulesCount: 15,
      category: "Technical",
    },
    {
      id: 4,
      name: "Quality Assurance Standard",
      project: "Shopping Mall Development",
      lastUsed: "2024-05-26",
      rulesCount: 10,
      category: "QA",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Saved Naming Standards</h2>
          <p className="text-gray-600 mt-1">Manage your custom naming convention rules</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Standard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Naming Standards</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Standard Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Associated Project</TableHead>
                <TableHead>Rules</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {namingStandards.map((standard) => (
                <TableRow key={standard.id}>
                  <TableCell className="font-medium">{standard.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{standard.category}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{standard.project}</TableCell>
                  <TableCell>{standard.rulesCount} rules</TableCell>
                  <TableCell className="text-gray-600">{standard.lastUsed}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
