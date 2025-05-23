import { ArrowUpRight, ArrowDownRight, Edit2, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Category } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface CategoryItemProps {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}

const CategoryItem = ({ category, onEdit, onDelete }: CategoryItemProps) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div 
            className="h-10 w-10 rounded-full flex items-center justify-center mr-3"
            style={{ backgroundColor: category.color + '33' }} // Add transparency
          >
            {category.type === 'income' ? (
              <ArrowUpRight 
                className="h-5 w-5" 
                style={{ color: category.color }} 
              />
            ) : (
              <ArrowDownRight 
                className="h-5 w-5" 
                style={{ color: category.color }} 
              />
            )}
          </div>
          
          <div>
            <h3 className="font-medium">{category.name}</h3>
            <span className="text-xs text-gray-500 capitalize">
              {category.type}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onEdit}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-500"
              onClick={onDelete}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {category.description && (
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
          {category.description}
        </p>
      )}
    </div>
  );
};

export default CategoryItem;
