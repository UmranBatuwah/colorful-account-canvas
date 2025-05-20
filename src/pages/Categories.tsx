import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Category } from '@/types';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '@/services/categories';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CategoryList from '@/components/categories/CategoryList';
import CategoryForm from '@/components/categories/CategoryForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load categories
    const loadData = async () => {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    };
    
    loadData();
  }, []);
  
  const handleAddCategory = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      console.log('Adding category with data:', data);
      const newCategory = await createCategory(data);
      console.log('Category created successfully:', newCategory);
      
      setCategories([...categories, newCategory]);
      
      toast({
        title: 'Category added',
        description: 'Your category has been added successfully',
      });
      
      setIsAddingCategory(false);
    } catch (error: any) {
      console.error('Detailed error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add category',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditCategory = async (id: string, data: Partial<Category>) => {
    try {
      const updatedCategory = await updateCategory(id, data);
      
      setCategories((prevCategories) =>
        prevCategories.map((c) =>
          c.id === id ? updatedCategory : c
        )
      );
      
      toast({
        title: 'Category updated',
        description: 'Your category has been updated successfully',
      });
      
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update category',
        variant: 'destructive',
      });
      
      return false;
    }
  };
  
  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      
      setCategories((prevCategories) =>
        prevCategories.filter((c) => c.id !== id)
      );
      
      toast({
        title: 'Category deleted',
        description: 'Your category has been deleted successfully',
      });
      
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive',
      });
      
      return false;
    }
  };

  return (
    <DashboardLayout title="Categories">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Categories</h2>
        <Button 
          onClick={() => setIsAddingCategory(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>
      
      <CategoryList
        categories={categories}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
      />
      
      {/* Add Category Dialog */}
      <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Add a new category for your transactions.
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            onSubmit={handleAddCategory}
            onCancel={() => setIsAddingCategory(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Categories;
