#!/usr/bin/env python3
"""
Test file watcher script to diagnose MkDocs live reload issues.

This script monitors the docs directory for file changes and reports them,
helping to determine if the issue is with file system event detection
or with MkDocs configuration.

Usage:
    python src/test-watcher.py [directory_to_watch]

Default watches: ./docs
"""

import sys
import time
from pathlib import Path

try:
    from watchdog.observers import Observer
    from watchdog.observers.polling import PollingObserver
    from watchdog.events import FileSystemEventHandler
except ImportError:
    print("Error: watchdog library not installed.")
    print("Install with: pip install watchdog")
    sys.exit(1)


class ChangeHandler(FileSystemEventHandler):
    """Handler that prints all file system events."""

    def __init__(self):
        self.event_count = 0

    def on_any_event(self, event):
        if event.is_directory:
            return

        # Skip temporary and hidden files
        src_path = event.src_path
        if any(part.startswith('.') for part in Path(src_path).parts):
            return
        if src_path.endswith(('.swp', '.tmp', '~')):
            return

        self.event_count += 1
        timestamp = time.strftime('%H:%M:%S')

        event_type = event.event_type.upper()
        print(f"[{timestamp}] #{self.event_count} {event_type}: {src_path}")


def get_observer_info():
    """Get information about the default observer being used."""
    observer = Observer()
    observer_class = observer.__class__.__name__

    # Check if using inotify (Linux), FSEvents (macOS), or polling
    try:
        from watchdog.observers.inotify import InotifyObserver
        is_inotify = isinstance(observer, InotifyObserver)
    except ImportError:
        is_inotify = False

    return observer_class, is_inotify


def main():
    # Determine watch directory
    if len(sys.argv) > 1:
        watch_path = Path(sys.argv[1])
    else:
        watch_path = Path('./docs')

    if not watch_path.exists():
        print(f"Error: Directory '{watch_path}' does not exist.")
        sys.exit(1)

    watch_path = watch_path.resolve()

    # Get observer info
    observer_class, is_inotify = get_observer_info()

    print("=" * 60)
    print("File Watcher Test")
    print("=" * 60)
    print(f"Watching: {watch_path}")
    print(f"Observer: {observer_class}")

    if is_inotify:
        print("Backend: inotify (native Linux file system events)")
    else:
        print("Backend: May be polling or platform-specific")

    print()
    print("Testing with NATIVE observer first...")
    print("Edit a file in the watched directory to see if events are detected.")
    print("Press Ctrl+C to switch to POLLING observer for comparison.")
    print("-" * 60)

    handler = ChangeHandler()
    observer = Observer()
    observer.schedule(handler, str(watch_path), recursive=True)

    try:
        observer.start()
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        observer.join()

        native_count = handler.event_count
        print()
        print(f"\nNative observer detected {native_count} events.")
        print()
        print("-" * 60)
        print("Now testing with POLLING observer...")
        print("This is slower but more reliable on some systems.")
        print("Edit a file again. Press Ctrl+C to exit.")
        print("-" * 60)

        handler2 = ChangeHandler()
        polling_observer = PollingObserver(timeout=1)
        polling_observer.schedule(handler2, str(watch_path), recursive=True)

        try:
            polling_observer.start()
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            polling_observer.stop()
            polling_observer.join()

            polling_count = handler2.event_count
            print()
            print("=" * 60)
            print("RESULTS")
            print("=" * 60)
            print(f"Native observer events:  {native_count}")
            print(f"Polling observer events: {polling_count}")
            print()

            if native_count == 0 and polling_count > 0:
                print("DIAGNOSIS: Native file system events are NOT working.")
                print("This is likely why MkDocs live reload isn't working.")
                print()
                print("SOLUTIONS:")
                print("1. Check inotify limits:")
                print("   cat /proc/sys/fs/inotify/max_user_watches")
                print("   sudo sysctl fs.inotify.max_user_watches=524288")
                print()
                print("2. Use polling in MkDocs by adding to mkdocs.yml:")
                print("   watch:")
                print("     - docs")
                print()
                print("3. Or try running MkDocs with:")
                print("   mkdocs serve --watch-theme")
            elif native_count == 0 and polling_count == 0:
                print("DIAGNOSIS: No events detected with either method.")
                print("Make sure you actually modified a file while testing.")
            else:
                print("DIAGNOSIS: File watching appears to be working.")
                print("The issue may be with MkDocs configuration.")
                print()
                print("Try these MkDocs options:")
                print("1. mkdocs serve --dirty  (faster rebuilds)")
                print("2. Check mkdocs.yml for watch configuration")
                print("3. Try: mkdocs serve --watch docs")


if __name__ == '__main__':
    main()
