
print("[Test] Reading server_logs.txt...")
try:
    with open("server_logs.txt", "r") as f:
        print(f.read())
except FileNotFoundError:
    print("[Test] No logs found yet.")
