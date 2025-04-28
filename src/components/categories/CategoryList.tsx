
import { useState } from 'react';
import { Search, Edit2, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Category } from '@/types';
import CategoryForm from './CategoryForm';
import CategoryItem from './CategoryItem';

interface CategoryListProps {
  categories: Category[];
  onEditCategory: (id: string, data: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
}

const CategoryList = ({
  categories,
  onEditCategory,
  onDeleteCategory,
}: CategoryListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter categories based on search query and selected tab
  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
      
    if (activeTab === 'all') {
      return matchesSearch;
    }
    
    return matchesSearch && category.type === activeTab;
  });
  
  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setIsEditing(true);
  };
  
  const handleDelete = (category: Category) => {
    setCurrentCategory(category);
    setIsDeleting(true);
  };
  
  const handleEditSubmit = async (values: any) => {
    if (!currentCategory) return;
    
    setIsSubmitting(true);
    try {
      await onEditCategory(currentCategory.id, values);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteConfirm = async () => {
    if (!currentCategory) return;
    
    setIsSubmitting(true);
    try {
      await onDeleteCategory(currentCategory.id);
      setIsDeleting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search categories..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expense">Expense</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredCategories.map((category) => (
                <Card key={category.id} className="overflow-hidden card-hover">
                  <CardContent className="p-0">
                    <CategoryItem
                      category={category}
                      onEdit={() => handleEdit(category)}
                      onDelete={() => handleDelete(category)}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No categories found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Edit Category Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => !isSubmitting && setIsEditing(open)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Make changes to your category below.
            </DialogDescription>
          </DialogHeader>
          {currentCategory && (
            <CategoryForm
              category={currentCategory}
              onSubmit={handleEditSubmit}
              onCancel={() => setIsEditing(false)}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={isDeleting} 
        onOpenChange={(open) => !isSubmitting && setIsDeleting(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this category and cannot be undone.
              Any transactions associated with this category will become uncategorized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoryList;
