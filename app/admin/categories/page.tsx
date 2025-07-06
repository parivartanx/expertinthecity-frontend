"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowUpDown, MoreHorizontal, Plus, Edit, Trash2, FolderOpen } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAdminAuthStore } from "@/lib/mainwebsite/auth-store";
import { useAdminCategoriesStore } from "@/lib/mainwebsite/admin-categories-store";

const categoryFormSchema = z.object({
    name: z.string().min(1, "Category name is required"),
});

const subcategoryFormSchema = z.object({
    name: z.string().min(1, "Subcategory name is required"),
    categoryId: z.string().min(1, "Category is required"),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;
type SubcategoryFormData = z.infer<typeof subcategoryFormSchema>;

export default function CategoriesPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"categories" | "subcategories">("categories");
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isSubcategoryDialogOpen, setIsSubcategoryDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [editingSubcategory, setEditingSubcategory] = useState<any>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<any>(null);

    const { isAuthenticated } = useAdminAuthStore();
    const {
        categories,
        subcategories,
        isLoading,
        error,
        fetchAllCategories,
        fetchAllSubcategories,
        createCategory,
        updateCategory,
        deleteCategory,
        createSubcategory,
        updateSubcategory,
        deleteSubcategory,
        clearError,
    } = useAdminCategoriesStore();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/admin/login");
        }
    }, [isAuthenticated, router]);

    // Show loading while checking authentication
    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // Fetch data on mount
    useEffect(() => {
        if (isAuthenticated) {
            fetchAllCategories();
            fetchAllSubcategories();
        }
    }, [isAuthenticated, fetchAllCategories, fetchAllSubcategories]);

    const categoryForm = useForm<CategoryFormData>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: "",
        },
    });

    const subcategoryForm = useForm<SubcategoryFormData>({
        resolver: zodResolver(subcategoryFormSchema),
        defaultValues: {
            name: "",
            categoryId: "",
        },
    });

    const handleCreateCategory = async (data: CategoryFormData) => {
        try {
            await createCategory(data);
            toast.success("Category created successfully");
            setIsCategoryDialogOpen(false);
            categoryForm.reset();
        } catch (error: any) {
            toast.error(error.message || "Failed to create category");
        }
    };

    const handleUpdateCategory = async (data: CategoryFormData) => {
        if (!editingCategory) return;
        try {
            await updateCategory(editingCategory.id, data);
            toast.success("Category updated successfully");
            setIsCategoryDialogOpen(false);
            setEditingCategory(null);
            categoryForm.reset();
        } catch (error: any) {
            toast.error(error.message || "Failed to update category");
        }
    };

    const handleCreateSubcategory = async (data: SubcategoryFormData) => {
        try {
            await createSubcategory(data);
            toast.success("Subcategory created successfully");
            setIsSubcategoryDialogOpen(false);
            subcategoryForm.reset();
        } catch (error: any) {
            toast.error(error.message || "Failed to create subcategory");
        }
    };

    const handleUpdateSubcategory = async (data: SubcategoryFormData) => {
        if (!editingSubcategory) return;
        try {
            await updateSubcategory(editingSubcategory.id, data);
            toast.success("Subcategory updated successfully");
            setIsSubcategoryDialogOpen(false);
            setEditingSubcategory(null);
            subcategoryForm.reset();
        } catch (error: any) {
            toast.error(error.message || "Failed to update subcategory");
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        try {
            if (activeTab === "categories") {
                await deleteCategory(itemToDelete.id);
                toast.success("Category deleted successfully");
            } else {
                await deleteSubcategory(itemToDelete.id);
                toast.success("Subcategory deleted successfully");
            }
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        } catch (error: any) {
            toast.error(error.message || "Failed to delete item");
        }
    };

    const openEditCategory = (category: any) => {
        setEditingCategory(category);
        categoryForm.reset({ name: category.name });
        setIsCategoryDialogOpen(true);
    };

    const openEditSubcategory = (subcategory: any) => {
        setEditingSubcategory(subcategory);
        subcategoryForm.reset({
            name: subcategory.name,
            categoryId: subcategory.categoryId
        });
        setIsSubcategoryDialogOpen(true);
    };

    const openDeleteDialog = (item: any) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    // Category columns
    const categoryColumns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Category Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: "subcategories",
            header: "Subcategories",
            cell: ({ row }) => {
                const subcategories = row.original.subcategories || [];
                return (
                    <Badge variant="secondary">
                        {subcategories.length} subcategories
                    </Badge>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: "Created",
            cell: ({ row }) => (
                <span>{format(new Date(row.original.createdAt), "MMM d, yyyy")}</span>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const category = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditCategory(category)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(category)}
                            className="text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    // Subcategory columns
    const subcategoryColumns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Subcategory Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: "category.name",
            header: "Category",
            cell: ({ row }) => row.original.category?.name || "N/A",
        },
        {
            accessorKey: "createdAt",
            header: "Created",
            cell: ({ row }) => (
                <span>{format(new Date(row.original.createdAt), "MMM d, yyyy")}</span>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const subcategory = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditSubcategory(subcategory)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(subcategory)}
                            className="text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Categories Management</h1>
                <Button
                    onClick={() => {
                        if (activeTab === "categories") {
                            setEditingCategory(null);
                            categoryForm.reset();
                            setIsCategoryDialogOpen(true);
                        } else {
                            setEditingSubcategory(null);
                            subcategoryForm.reset();
                            setIsSubcategoryDialogOpen(true);
                        }
                    }}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add {activeTab === "categories" ? "Category" : "Subcategory"}
                </Button>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
                <Button
                    variant={activeTab === "categories" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("categories")}
                >
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Categories
                </Button>
                <Button
                    variant={activeTab === "subcategories" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("subcategories")}
                >
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Subcategories
                </Button>
            </div>

            {isLoading && (
                <div className="text-muted-foreground mb-2">Loading...</div>
            )}
            {error && (
                <div className="text-red-500 mb-2">
                    {error} <Button variant="link" onClick={clearError}>Clear</Button>
                </div>
            )}

            {/* Data Table */}
            <DataTable
                columns={activeTab === "categories" ? categoryColumns : subcategoryColumns}
                data={activeTab === "categories" ? categories : subcategories}
                searchColumn="name"
                searchPlaceholder={`Search ${activeTab}...`}
            />

            {/* Category Dialog */}
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategory ? "Edit Category" : "Create Category"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCategory
                                ? "Update the category information below."
                                : "Add a new category to the system."
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...categoryForm}>
                        <form onSubmit={categoryForm.handleSubmit(
                            editingCategory ? handleUpdateCategory : handleCreateCategory
                        )} className="space-y-4">
                            <FormField
                                control={categoryForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter category name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {editingCategory ? "Update" : "Create"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Subcategory Dialog */}
            <Dialog open={isSubcategoryDialogOpen} onOpenChange={setIsSubcategoryDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingSubcategory ? "Edit Subcategory" : "Create Subcategory"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingSubcategory
                                ? "Update the subcategory information below."
                                : "Add a new subcategory to a category."
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...subcategoryForm}>
                        <form onSubmit={subcategoryForm.handleSubmit(
                            editingSubcategory ? handleUpdateSubcategory : handleCreateSubcategory
                        )} className="space-y-4">
                            <FormField
                                control={subcategoryForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subcategory Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter subcategory name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={subcategoryForm.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsSubcategoryDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {editingSubcategory ? "Update" : "Create"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this {activeTab === "categories" ? "category" : "subcategory"}?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 