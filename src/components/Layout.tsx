import { Outlet, Link } from "react-router-dom"; // Make sure Link is imported
import { Menu, MessageSquare, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import cropFieldBg from "@/assets/crop-field-bg.jpg";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen relative">
      {/* Background image with blur overlay */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${cropFieldBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 backdrop-blur-[2px] bg-background/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        <header className="flex items-center justify-between px-4 py-3 bg-background/30 backdrop-blur-md">
          <div className="flex items-center gap-2">

            {/* Sidebar */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="w-5 h-5 text-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-card/90 backdrop-blur-md">
                <SheetHeader>
                  <SheetTitle>Krishi Mitra</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-4">
                  <SheetClose asChild>
                    <Button asChild variant="ghost" className="justify-start gap-2">
                      <Link to="/">
                        <MessageSquare className="w-4 h-4" />
                        Chat Assistant
                      </Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button asChild variant="ghost" className="justify-start gap-2">
                      <Link to="/classify">
                        <Scan className="w-4 h-4" />
                        Disease Classification
                      </Link>
                    </Button>
                  </SheetClose>
                </nav>
              </SheetContent>
            </Sheet>

            {/* CHANGED:
              1. Wrapped the title in a <Link to="/"> component.
              2. Made it larger and bolder with 'text-lg font-bold'.
              3. Added 'no-underline' to prevent default link styling.
            */}
            <Link to="/" className="text-lg font-bold text-foreground no-underline">
              Krishi Mitra
            </Link>
          </div>
        </header>

        {/* This Outlet renders the current page */}
        <Outlet />

      </div>
    </div>
  );
};

export default Layout;